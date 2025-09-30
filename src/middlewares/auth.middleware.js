import { User } from '../models/user.model.js';
import { Developer } from '../models/developer.model.js';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler  from '../utils/asyncHandler.js';
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Check in User collection
    let account = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    // If not found, check in Developer collection
    if (!account) {
      account = await Developer.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );
    }

    if (!account) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = account;
    req.role = decodedToken.role; // store role from JWT payload
    next();
  } 
  
  catch (error) {
    throw new ApiError(400, error?.message || "Invalid access token");
  }
});

export { verifyJWT };
