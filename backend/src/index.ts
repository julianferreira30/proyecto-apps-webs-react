import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express, { NextFunction, Request, Response } from "express";
import GameModel from "./models/game";
import config from "./utils/config";
import logger from "./utils/logger";

const app = express();
app.use(express.json());

mongoose.set("strictQuery", false);

if (config.MONGODB_URI) {
  mongoose.connect(config.MONGODB_URI).catch((error) => {
    logger.error("error connecting to MongoDB: ", error.message);
  });
}

const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    next();
};
app.use(requestLogger);

app.get("/api/games", (request, response) => {
    GameModel.find({}).then((games) => {
    response.json(games);
  });
});

app.get("/api/games/:id", (request, response, next) => {
    const { id } = request.params;
    GameModel.findById(id)
    .then((game) => {
        if (game) {
            response.json(game);
        } else {
            response.status(404).end();
        }
    })
    .catch((error) => next(error));
});

app.post("/api/games", (request, response, next) => {
    const body = request.body;
    
    const game = new GameModel({
        name: body.name,
        releaseDate: body.releaseDate,
        creator: body.creator,
        genre: body.genre,
        image: body.image,
    });

    game.save()
        .then((savedGame) => {
            response.status(201).json(savedGame);
        })
        .catch((error) => next(error));
});
