"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReview = void 0;
const game_1 = __importDefault(require("../models/game"));
const users_1 = __importDefault(require("../models/users"));
const review_1 = __importDefault(require("../models/review"));
const validations_1 = require("../utils/validations");
const addReview = async (request, response, next) => {
    try {
        const body = request.body;
        const user = await users_1.default.findById(request.userId);
        if (!user) {
            return response.status(401).json({ error: "Solo un usuario autenticado puede agregar una review a un juego" });
        }
        ;
        const game = await game_1.default.findById(body.game);
        if (!game) {
            return response.status(404).json({ error: "Juego no encontrado" });
        }
        ;
        if (!(0, validations_1.validateInputNumber)(body.rating, 0, 5) || !(0, validations_1.validateInputString)(body.content, 1, 1000) || !Number.isInteger(body.rating * 2)) {
            return response.status(400).json({ error: "Faltan datos o no son del tipo correcto" });
        }
        ;
        const review = new review_1.default({
            rating: body.rating,
            content: body.content.trim(),
            author_name: user.username,
            author_profile_image: user.profile_image,
            game: game._id,
        });
        await review.save();
        if (!user.reviews.includes(review._id)) {
            user.reviews.splice(0, 0, review._id);
        }
        if (!user.played.includes(game._id)) {
            user.played.splice(0, 0, game._id);
        }
        await user.save();
        if (!game.reviews.includes(review._id)) {
            game.reviews.splice(0, 0, review._id);
            await game.save();
        }
        await game.populate(["reviews"]);
        const reviews = game.reviews;
        const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        game.rating = parseFloat(avgRating.toFixed(2));
        await game.save();
        return response.status(201).json(review);
    }
    catch (error) {
        next(error);
    }
};
exports.addReview = addReview;
