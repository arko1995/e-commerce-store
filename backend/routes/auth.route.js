import express from "express";

import {
  signUpAuth,
  loginAuth,
  logOutAuth,
  refreshToken,
  getProfile,
} from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", signUpAuth);
router.post("/login", loginAuth);
router.post("/logout", logOutAuth);
router.post("/refresh-token", refreshToken);
router.get("/profile", getProfile);

export default router;
