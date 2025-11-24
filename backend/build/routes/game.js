"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const game_1 = require("../controllers/game");
const middleware_1 = require("../utils/middleware");
const router = express_1.default.Router();
router.get("/", game_1.getAllGames);
router.get("/:id", game_1.getGameById);
router.post("/", middleware_1.withUser, game_1.addGame);
router.put("/:id", middleware_1.withUser, game_1.setGame);
exports.default = router;
