import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";

const app = express();
// allow requests from specific origins
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)

// express middlewares
app.use(express.json({limit: "16kvb"}));
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// routes
app.use("/api/v1/users", userRouter);

// custom error handler
app.use(errorHandler);
app.use(cookieParser());

export { app };