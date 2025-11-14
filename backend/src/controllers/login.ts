import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import User from "../models/users";
import config from "../utils/config";
import crypto from "crypto";

export const login = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const username = request.body.username.trim().toLowerCase();
    const password = request.body.password.trim();

    const user = await User.findOne({ username });
    if (user) {
      const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
      if (!passwordCorrect) {
        return response.status(401).json({ error: "Nombre de usuario o contraseña inválido" });
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

        const fullUser = await user.populate(["added", "played", "favourites", "wishlist", "reviews"]);
        return response.status(200).json(fullUser);
      }
    } else {
      return response.status(401).json({
        error: "Nombre de usuario o contraseña inválido",
      });
    }
  } catch (error) {
    next(error);
  }
}

export const getCurrentUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const user = await User.findById(request.userId).populate(["added", "played", "favourites", "wishlist", "reviews"]);
    if (!user) {
      return response.status(404).json({ error: "Usuario no encontrado" });
    }
    return response.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export const logout = async (request: Request, response: Response, next: NextFunction) => {
  response.clearCookie("token");
  return response.status(200).json({ message: "Cierre de sesión exitoso" });
}