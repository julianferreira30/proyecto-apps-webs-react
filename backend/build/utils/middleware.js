"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("./config"));
const withUser = async (req, res, next) => {
    try {
        const authReq = req;
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({ error: "missing token" });
        }
        else {
            const decodedToken = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
            const csrfToken = req.headers["x-csrf-token"];
            if (typeof decodedToken === "object" &&
                decodedToken.id &&
                decodedToken.csrf == csrfToken) {
                authReq.userId = decodedToken.id;
                next();
            }
            else {
                res.status(401).json({ error: "invalid token" });
            }
        }
    }
    catch (error) {
        res.status(401).json({ error: "invalid token" });
    }
};
exports.withUser = withUser;
