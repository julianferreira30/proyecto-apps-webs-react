"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_1 = __importDefault(require("../models/users"));
const validations_1 = require("../utils/validations");
const register = async (request, response, next) => {
    try {
        const profileImage = request.body.profile_image ? ((0, validations_1.validateInputStringImage)(request.body.profile_image) ? request.body.profile_image.trim() : "") : undefined;
        const username = request.body.username ? ((0, validations_1.validateInputString)(request.body.username, 5, 30) ? request.body.username.trim().toLowerCase() : "") : undefined;
        const name = request.body.name ? ((0, validations_1.validateInputString)(request.body.name, 1, 50) ? request.body.name.trim() : "") : undefined;
        const password = request.body.password ? ((0, validations_1.validateInputString)(request.body.password, 8, 30) ? request.body.password.trim() : "") : undefined;
        if (!username || !name || !password || profileImage === "") {
            return response.status(400).json({ error: "Faltan datos o no son del tipo correcto" });
        }
        ;
        const existing = await users_1.default.findOne({ username });
        if (existing) {
            return response.status(409).json({ error: "El nombre de usuario dado ya existe" });
        }
        ;
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = new users_1.default({ profile_image: profileImage, username, name, passwordHash });
        await user.save();
        return response.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
