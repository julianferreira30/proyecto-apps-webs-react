"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const middleware_1 = require("../utils/middleware");
const router = express_1.default.Router();
router.post("/favorites", middleware_1.withUser, users_1.addToFavorites);
router.post("/wishlist", middleware_1.withUser, users_1.addToWhislist);
router.post("/played", middleware_1.withUser, users_1.addToPlayed);
router.delete("/favorites/:gameId", middleware_1.withUser, users_1.deleteFromFavorites);
router.delete("/wishlist/:gameId", middleware_1.withUser, users_1.deleteFromWhislist);
router.delete("/played/:gameId", middleware_1.withUser, users_1.deleteFromPlayed);
exports.default = router;
