import { Request, Response, NextFunction } from 'express';
import Game from '../models/game';
import User from '../models/users';
import Review from '../models/review';
import { validateInputNumber, validateInputString } from '../utils/validations';

export const addReview = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const body = request.body;

        const user = await User.findById(request.userId);
        if (!user) {
            return response.status(401).json({ error: "Solo un usuario autenticado puede agregar una review a un juego" });
        };

        const game = await Game.findById(body.game);
        if (!game) {
            return response.status(404).json({ error: "Juego no encontrado" });
        };

        if (!validateInputNumber(body.rating, 0, 5) || !validateInputString(body.content, 1, 1000) || !Number.isInteger(body.rating * 2)) {
            return response.status(400).json({ error: "Faltan datos o no son del tipo correcto" });
        };

        const review = new Review({
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
        const reviews = game.reviews as unknown as { rating: number }[];
        const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) /reviews.length : 0;
        game.rating = parseFloat(avgRating.toFixed(2));
        await game.save();

        return response.status(201).json(review);
    } catch (error) {
        next(error);
    }
}