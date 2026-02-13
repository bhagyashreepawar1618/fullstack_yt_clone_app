import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateAccessAndRefreshToekns = async (userId) => {
  try {
    const user = await User.findOne(userId);
    //we've got all the properties in user (user is an object)
    console.log(user, "this is a response from mongodb");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.accessToken = accessToken;

    //directly save in database without validation
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong While generating Refresh and Access Token"
    );
  }
};

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

  console.log(req.body);
  console.log(req.files);

  //validation
  if (fullname === "" || username === "" || password === "" || email === "") {
    throw new ApiError(400, "All feilds are compulsory");
  }

  //if user is already registered
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  //throw an error
  if (existedUser) {
    throw new ApiError(409, "User with email or username Already Exists...");
  }

  //console.log (req.files)
  const avtarLocalPath = req.files?.avtar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avtarLocalPath) {
    throw new ApiError(400, "Avtar file is required");
  }

  //after getting the local path uload them on cloudinary
  //use await because it is an time taking process
  const avtar = await uploadOnCloudinary(avtarLocalPath);

  let coverImage = "";
  if (coverImageLocalPath) {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  }

  if (!avtar) {
    throw new ApiError(400, "Avtar file is required");
  }

  //use .create method to store all in database
  //for this particular user all feilds are stores in user database

  const user = await User.create({
    fullname,
    avtar: avtar?.url,
    //we haven't verifeid if user has upload the coverImage or not
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

//login user
const loginUser = asyncHandler(async (req, res) => {
  //take username and password from req.body
  //check if username password is present or not
  //find the user in database
  //if user find
  //check password
  //access and refresh token
  //send cookie
  const { email, username, password } = req.body;

  //atleast one is required
  if (!username || !email) {
    throw new ApiError(400, "username or password is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  //if not found
  if (!user) {
    throw new ApiError(400, "User is not registered..!!");
  }

  const isPassValid = await user.isPasswordCorrect(password);

  //if password is not true
  if (!isPassValid) {
    throw new ApiError(401, "Invalid user Credentials");
  }

  //if password is correct generate refresh and accesstokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToekns(
    user._id
  );

  //send cookie
  //remove password and refresh token then send the response
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken "
  );

  //cookie is not modifiable by browser
  //it can be only modified in server
  const options = {
    httpOnly: true,
    secure: true,
  };

  //response

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

//logout
const logoutUser = asyncHandler((req, res) => {
  //cookies clear
  //and generate refreshToken again
});
export { registerUser, loginUser, logoutUser };
