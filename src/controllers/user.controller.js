import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get details from user (frontend)
  //validation if email is correct -not empty fields
  //check if user already exists
  //check for images, check for avtar
  //upload them to cloudinary
  //create user object -crate entry in db
  //remove password and refreshtoken feild from response
  //check for user creation
  //return response

  const { fullname, email, username, password } = req.body;
  console.log("email", email);

  //validation
  if (fullname === "" || username === "" || password === "" || email === "") {
    throw new ApiError(400, "All feilds are compulsory");
  }

  //if user is already registered
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  //throw an error
  if (existedUser) {
    throw new ApiError(409, "User with email or username Already Exists...");
  }

  //console.log req.files
  const avtarLocalPath = req.files?.avtar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avtarLocalPath) {
    throw new ApiError(400, "Avtar file is required");
  }

  const avtar = await uploadOnCloudinary(avtarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avtar) {
    throw new ApiError(400, "Avtar file is required");
  }

  const user = await User.create({
    fullname,
    avtar: avtar.url,
    //we haven't verifeid if user has upload the avtar or not
    //therefore check or condition
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  //user is entry User is Schema
  //checks if user is created in database using _id
  //if it exists then remove password and -refreshToken
  //.select removes entered fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //if created user doesnot exists
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully..."));
});
export default registerUser;
