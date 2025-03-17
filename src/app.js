import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import env from "./vars/env.js";

const app = express();
// allow requests from specific origins
app.use(
    cors({
        origin: env.CORS_ORIGIN,
        credentials: true
    })
)

// express middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(errorHandler);

// routes
app.use("/api/v1/users", userRouter);

export { app };