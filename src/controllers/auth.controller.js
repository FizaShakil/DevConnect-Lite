import asyncHandler from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { User } from "../models/user.model.js";
import { Developer } from "../models/developer.model.js";

export const generateAccessAndRefreshToken = async (id, role) => {
  try {
    // Pick model based on role
    const Model = role === "developer" ? Developer : User;

    const account = await Model.findById(id);
    if (!account) {
      throw new ApiError(404, `${role} not found`);
    }

    const accessToken = account.generateAccessTokens();
    const refreshToken = account.generateRefreshTokens();

    account.refreshToken = refreshToken;
    await account.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while generating tokens"
    );
  }
};

const userSignup = asyncHandler( async(req,res)=> {

const {username, email, password} = req.body

    if ([username, email, password].some((field) => !field?.trim()))
      {
        throw new ApiError(400, "All fields are required")
      }

const existedUser = await User.findOne({email})

if(existedUser){
  throw new ApiError(401, "User Already exists")
}

const user = await User.create({
      username,
      email,
      password
   })

 const createdUser = await User.findById(user._id).
 select("-password -refreshToken")

   if(!createdUser){
      throw new ApiError(400, "Something went wrong while signing up")
     }
 //generate access and refreshtoken
 const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id, user.role)

 const options = {
  httpOnly: true,
  secure: true
 }

 return res
.status(201)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(
    new ApiResponse(200, {
        user: createdUser, 
        accessToken, 
        refreshToken
    }, "User Signup Successful! ")
)

})

const developerSignup = asyncHandler( async(req,res)=> {
  const {username, email, password} = req.body

    if ([username, email, password].some((field) => !field?.trim()))
      {
        throw new ApiError(400, "All fields are required")
      }

const existedDeveloper = await Developer.findOne({email})

if(existedDeveloper){
  throw new ApiError(401, "Developer Already exists")
}

const developer = await Developer.create({
      username,
      email,
      password
   })

 const createdDeveloper = await Developer.findById(developer._id).
 select("-password -refreshtoken")

   if(!createdDeveloper){
      throw new ApiError(400, "Something went wrong while signing up")
     }
 //generate access and refreshtoken
 const {accessToken, refreshToken} = await generateAccessAndRefreshToken(developer._id, developer.role)

 const options = {
  httpOnly: true,
  secure: true
 }

 return res
.status(201)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(
    new ApiResponse(200, {
        user: createdDeveloper, 
        accessToken, 
        refreshToken
    }, "Developer Signup Successful! ")
)

})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Try User first
  let account = await User.findOne({ email });
  let role = "user";

  // If not found, try Developer
  if (!account) {
    account = await Developer.findOne({ email });
    role = "developer";
  }

  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  // Validate password
  const isPasswordValid = await account.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    account._id,
    role
  );

  // Clean user object
  const loggedInAccount = await (role === "developer" ? Developer : User)
    .findById(account._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true, // keep secure:true for prod, false for local dev
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInAccount,
          role,
          accessToken,
          refreshToken,
        },
        `${role} logged in successfully!`
      )
    );
});


export {userSignup, developerSignup, login}