import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

userSchema.pre("save", async (next) => {
    const user = this;
    if (user.isModified("password")) {
        this.password = bcrypt(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async () => {
    const user = this;
    return await bcrypt.compare(password, user.password);
}

userSchema.methods.generateAccessToken = () => {
    const user = this;
    return jwt.sign(
        {
            _id: user._id,
            username: user.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    );
}

userSchema.methods.generateRefreshToken = () => {
    const user = this
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    );
}

export const User = mongoose.model("User", userSchema);