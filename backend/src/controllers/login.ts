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
      const fullUser = await User.findById(user._id).populate("favourites").populate("wishlist").lean();
      if (!fullUser) {
        return response.status(404).json({error:"Ususario no encontrado"})
      }
      const mapGames = (games: any[]) => games.map(g => ({
        ...g,
        id: g._id.toString()
      }));
            response.status(200).send({ id: fullUser._id.toString(), username: fullUser.username, name: fullUser.name, favourites: mapGames(fullUser.favourites), wishlist: mapGames(fullUser.wishlist) });
    }
  } else {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }
});
router.get("/auth/me", withUser, async (request, response, next) => {
  const body = request.body;
  const user = await User.findById(request.userId).populate("favourites").populate("wishlist").lean();
  if (!user) {
    return response.status(404).json({error:"Ususario no encontrado"})
  }
  const mapGames = (games: any[]) => games.map(g => ({
    ...g,
    id: g._id.toString()
  }));
  response.status(200).send({ id: user._id.toString(), username: user.username, name: user.name, favourites: mapGames(user.favourites), wishlist: mapGames(user.wishlist) });
});
router.post("/logout", (request, response) => {
  response.clearCookie("token");
  return response.status(200).send({
    message: "Logged out succesfully",
  });
});
export default router;
