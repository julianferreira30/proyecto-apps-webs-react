import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import User from "../models/users";
import config from "../utils/config";
import crypto from "crypto";
import { withUser } from "../utils/middleware";

const router = express.Router();

router.post("/", async (request, response) => {
  const { username, password } = request.body;
  const user = await User.findOne({ username });
  if (user) {
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordCorrect) {
      return response.status(401).json({
        error: "invalid username or password",
      });
    } else {
      const userForToken = {
        username: user.username,
        csrf: crypto.randomUUID(),
        id: user._id,
      };
      const token = jwt.sign(userForToken, config.JWT_SECRET, {
        expiresIn: 60 * 60,
      });
      response.setHeader("X-CSRF-Token", userForToken.csrf);
      response.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
      });
      response.status(200).send({ username: user.username, name: user.name });
    }
  } else {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }
});
router.get("/auth/me", withUser, async (request, response, next) => {
  const body = request.body;
  const user = await User.findById(request.userId);
  return response.status(200).json(user);
});
router.post("/logout", (request, response) => {
  response.clearCookie("token");
  return response.status(200).send({
    message: "Logged out succesfully",
  });
});
export default router;
