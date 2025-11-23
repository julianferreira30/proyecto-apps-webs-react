"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_1 = require("../controllers/login");
const middleware_1 = require("../utils/middleware");
const router = express_1.default.Router();
router.post("/", login_1.login);
router.get("/auth/me", middleware_1.withUser, login_1.getCurrentUser);
router.post("/logout", login_1.logout);
exports.default = router;
