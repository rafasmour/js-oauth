import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    getCurrentUser,
    changeCurrentPassword,
    updateAccountDetails
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(
    registerUser
);

router.route("/login").post(
    loginUser
);

router.route("/logout").post(
    verifyJWT,
    logoutUser
);

router.route("/me").get(
    verifyJWT,
    getCurrentUser
)

router.route("/change-password").post(
    verifyJWT,
    changeCurrentPassword
)

router.route("/update-account").post(
    verifyJWT,
    updateAccountDetails
)

export default router;
