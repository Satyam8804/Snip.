import { registerUser, loginUser, logout, getMe } from "../controllers/user.conroller.js";
import { Router } from "express";
import {refreshAccessToken} from '../auth/refreshToken.js'
import protect from '../middlewares/auth.middleware.js';

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post('/refresh',refreshAccessToken);

router.post("/logout",protect,logout)

router.get("/me", protect, getMe);

export default router;
