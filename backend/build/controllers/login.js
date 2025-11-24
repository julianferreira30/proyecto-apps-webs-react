"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getCurrentUser = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_1 = __importDefault(require("../models/users"));
const config_1 = __importDefault(require("../utils/config"));
const crypto_1 = __importDefault(require("crypto"));
const login = async (request, response, next) => {
    try {
        const username = request.body.username.trim().toLowerCase();
        const password = request.body.password.trim();
        const user = await users_1.default.findOne({ username });
        if (user) {
            const passwordCorrect = await bcrypt_1.default.compare(password, user.passwordHash);
            if (!passwordCorrect) {
                return response.status(401).json({ error: "Nombre de usuario o contraseña inválido" });
            }
            else {
                const userForToken = {
                    username: user.username,
                    csrf: crypto_1.default.randomUUID(),
                    id: user._id,
                };
                const token = jsonwebtoken_1.default.sign(userForToken, config_1.default.JWT_SECRET, {
                    expiresIn: 60 * 60,
                });
                response.setHeader("X-CSRF-Token", userForToken.csrf);
                response.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV == "production",
                });
                const fullUser = await user.populate(["added", "played", "favorites", "wishlist", "reviews"]);
                return response.status(200).json(fullUser);
            }
        }
        else {
            return response.status(401).json({
                error: "Nombre de usuario o contraseña inválido",
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const getCurrentUser = async (request, response, next) => {
    try {
        const user = await users_1.default.findById(request.userId).populate(["added", "played", "favorites", "wishlist", "reviews"]);
        if (!user) {
            return response.status(404).json({ error: "Usuario no encontrado" });
        }
        return response.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.getCurrentUser = getCurrentUser;
const logout = async (request, response, next) => {
    response.clearCookie("token");
    return response.status(200).json({ message: "Cierre de sesión exitoso" });
};
exports.logout = logout;
