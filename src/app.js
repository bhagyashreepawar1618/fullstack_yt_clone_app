import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "10kb",
  })
);

//congig for express to understand browser encoder
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

app.use(cookieParser());

//to store images and files in public
app.use(express.static("public"));

export default app;
