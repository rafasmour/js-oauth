import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../vars/env.js";

const userSchema = new Schema (
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minLength: 8,
            maxLength: 20
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxLength: 100
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
            maxLength: 100
        },
        refreshToken: {
            type: String
        }
    },
    { timestamps: true}
);

userSchema.pre("save", async function(next) {
    if(this.isModified("password"))
        this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password)  {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.changePassword = async function(newPassword) {
    this.password = newPassword;
    await this.save();
}

userSchema.methods.generateAccessToken = function()  {
    const user = this;
    return jwt.sign(
        {
            _id: user._id,
            username: user.username,
        },
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: env.ACCESS_TOKEN_EXPIRY}
    );
}

userSchema.methods.generateRefreshToken = function()  {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        env.REFRESH_TOKEN_SECRET,
        { expiresIn: env.REFRESH_TOKEN_EXPIRY}
    );
}

export const User = mongoose.model("User", userSchema);