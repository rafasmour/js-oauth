import validator from "email-validator";
import { emptyFields } from "../utils/emptyFields";
import {User} from "../models/user.models";

export const validateEmail =  (email) => validator.validate(email);
export const userRegisterValidation = (user) => {
    // checks if any field contains only whitespaces
    if( emptyFields(user) ) {
        return {
            errorCode: 400,
            message: "All fields are required"
        }
    }
    const usernameLength = user.username.length;
    const validUsernameLength = usernameLength >= 3 && usernameLength <= 20;
    if(!user.username || !validUsernameLength) {
        if(!validLength) {
            return {
                errorCode: 400,
                message: "Username must be between 3 and 20 characters"
            }
        }
    }

    const emailLength = user.email.length;
    const validEmail = validateEmail(user.emailz);
    const validEmailLength = emailLength >= 3 && emailLength <= 100;
    const isValidEmail = (validEmail && validEmailLength);
    if(!user.email || !isValidEmail) {
        return {
            errorCode: 400,
            message: "Invalid email address"
        }
    }

    const passLength = user.password.length;
    const validPassLength = passLength >= 8 && passLength <= 100;
    if(!user.password || !validPassLength) {
        return {
            errorCode: 400,
            message: "Password must be between 8 and 100 characters"
        }
    }

    return true;
}

export const userLoginValidation = async (user) => {
    if( emptyFields(user) ) {
        return {
            errorCode: 400,
            message: "All fields are required"
        }
    }


    const validUser = await User.findOne({
      email: user.email
    })

    if(!validUser) {
        return {
            errorCode: 404,
            message: "User not found"
        }
    }

    const isPasswordCorrect = await validUser.isPasswordCorrect(user.password);
    if(!isPasswordCorrect) {
        return {
            errorCode: 400,
            message: "Invalid credentials"
        }
    }

    return true;
}

export const setEmail = async (userId, email) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                email: email,
            }
        },
        {new: true}
    )

    if(!user) {
        return ({
            errorCode: 500,
            message: "Failed to update email"
        })
    }

    return true;
}