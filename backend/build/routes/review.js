"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_1 = require("../controllers/review");
const middleware_1 = require("../utils/middleware");
const router = express_1.default.Router();
router.post("/", middleware_1.withUser, review_1.addReview);
exports.default = router;
