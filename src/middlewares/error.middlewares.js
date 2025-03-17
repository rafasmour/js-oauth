import mongoose from "mongoose";

import ApiError from "../utils/ApiError.js";
import env from "../vars/env.js";

const errorHandler = (error, req, res, next) => {
    if(!(error instanceof ApiError)) {
        const statusCode = error?.statusCode || error instanceof mongoose.Error ? 400 : 500;

        const message = error?.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || [], error?.stack || [])
    }

    const response = {
        ...error,
        message: error.message,
        ...(env.NODE_ENV === "development" ? { stack: error.stack} : {})
    }

    return res?.status(error.statusCode)?.json(response);
}

export { errorHandler };