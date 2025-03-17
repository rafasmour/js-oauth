import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {setEmail, userRegisterValidation, userLoginValidation, validateEmail} from "../services/user.services.js";
import { User } from '../models/user.models.js';
import jwt from 'jsonwebtoken';
import env from "../vars/env.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        console.log(user);
        if(!user){
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save();
        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Failed to generate Tokens");
    }
}

const registerUser = asyncHandler( async( req, res ) => {
    console.log('something should be happening here')
    const { username, email, password } = req.body;
    const validUser = userRegisterValidation({ username, email, password });
    if(validUser.errorCode){
        throw new ApiError(
            validUser.errorCode,
            validUser.message
        )
    }

    try {
        const user = await User.create({
            username,
            email,
            password,
        })
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!createdUser){
            throw new ApiError(500, "Failed to create user");
        }

        return res
            .status(201)
            .json(
                new ApiResponse(201, "User created successfully", createdUser)
            )
    } catch (error) {
        console.log(error)
        throw new ApiError (500, "Failed to register User");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const validUser = await userLoginValidation({ email, password });
    if(!validUser){
        throw new ApiError(
            validUser.errorCode,
            validUser.message
        )
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(validUser._id);

    const loggedInUser = await User.findById(validUser._id).select("-password -refreshToken");

    if(!loggedInUser) {
        throw new ApiError(
            500,
            "Failed to login User"
        )
    }

    const options = {
        httpOnly: true,
        secure: env.NODE_ENV === "production"
    }
    console.log(accessToken, refreshToken);
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, "User logged in successfully", loggedInUser));
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            }
        },
        {new: true}
    )

    const options = {
        httpOnly: true,
        secure: env.NODE_ENV === "production"
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User logged out success"), {})
})

const changeCurrentPassword = asyncHandler ( async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id)

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordValid) {
        throw new ApiError(401, "Old password is incorrect");
    }

    const passChanged = user.changePassword(newPassword);

    return res
        .status(200)
        .json(new ApiResponse(200, "Password changed successfully", passChanged))
})

const getCurrentUser = asyncHandler( async (req, res) => {

    return res
        .status(200)
        .json(new ApiResponse(200, "Current user details", req.user))
})

const updateAccountDetails = asyncHandler( async (req, res) => {
    const { email } = req.body;

    if(!email) {
        throw new ApiError(400, "Email is required");
    }

    const validEmail = validateEmail(email);

    if(!validEmail) {
        return new ApiError(400, "invalid email address");
    }

    const userId = req.user?._id;

    if(!userId) {
        throw new ApiError(400, "Couldn't find user");
    }

    const emailChanged = await setEmail(userId, email);

    if(!emailChanged) {
        throw new ApiError(
            emailChanged.errorCode,
            emailChanged.message
        )
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Email updated successfully", {}))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails
}