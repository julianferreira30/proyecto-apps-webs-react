import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/users";
import { validateInputString, validateInputStringImage } from '../utils/validations'

export const register = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const profileImage = request.body.profile_image ? (validateInputStringImage(request.body.profile_image) ? request.body.profile_image.trim() : "") : undefined;
    const username = request.body.username ? (validateInputString(request.body.username, 5, 30) ? request.body.username.trim().toLowerCase() : "") : undefined;
    const name = request.body.name ? (validateInputString(request.body.name, 1, 50) ? request.body.name.trim() : "") : undefined;
    const password = request.body.password ? (validateInputString(request.body.password, 8, 30) ? request.body.password.trim() : "") : undefined;

    if (!username || !name || !password || profileImage === "") {
      return response.status(400).json({ error: "Faltan datos o no son del tipo correcto" });
    };

    const existing = await User.findOne({ username });
    if (existing) {
      return response.status(409).json({ error: "El nombre de usuario dado ya existe" });
    };

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ profile_image: profileImage, username, name, passwordHash });
    await user.save();
    return response.status(201).json(user);
  } catch (error) {
    next(error);
  }
}