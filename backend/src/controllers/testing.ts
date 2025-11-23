// ...existing code...
import express from "express";
import User from "../models/users";
import Review from "../models/review";
import Game from "../models/game";

const router = express.Router();

router.post("/reset", async (request, response) => {
    await User.deleteMany({});
    await Review.deleteMany({});
    await Game.deleteMany({});

    response.status(204).end();
});

export default router;
