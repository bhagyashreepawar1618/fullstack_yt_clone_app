import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

import { upload } from "../middlewares/multer.middleware.js";

//middleware code here
router.route("/register").post(
  //middleware of multer
  //used array because we have uploaded 2 filelds
  upload.fields([
    {
      name: "avtar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

export default router;
