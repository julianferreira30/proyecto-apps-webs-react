import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express, { NextFunction, Request, Response } from "express";
import GameModel from "./models/game";
import config from "./utils/config";
import logger from "./utils/logger";
import cookieParser from "cookie-parser";
import cors from "cors";
import registerRouter from "./controllers/register";
import loginRouter from "./controllers/login";
import { withUser } from "./utils/middleware";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const app = express();
app.use(express.json());
app.use(cookieParser());

const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

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

app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);

app.get("/api/games", async (request, response) => {
  GameModel.find({}).then((games) => {
    response.json(games);
  });
});

app.get("/api/games/:id", async (request, response, next) => {
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

app.post("/api/games", withUser, async (request, response, next) => {
  const body = request.body;

  const game = new GameModel({
    name: body.name,
    release_year: body.release_year,
    creator: body.creator,
    genre: body.genre,
    image: body.image,
    description: body.description,
    rating: body.rating,
  });

  game
    .save()
    .then((savedGame) => {
      response.status(201).json(savedGame);
    })
    .catch((error) => next(error));
});

app.put("/api/games/:id", withUser, async (request, response, next) => {
  const id = request.params.id;
  const body = request.body;

  GameModel.findByIdAndUpdate(id, body, { new: true })
    .then((updatedGame) => {
      if (updatedGame) {
        response.status(200).json(updatedGame);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/games/:id", withUser, async (request, response, next) => {
  const { id } = request.params;

  GameModel.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

const errorHandler = (
  error: { name: string; message: string },
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.error(error.message);

  console.error(error.name);
  if (error.name === "CastError") {
    response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);
app.use(express.static("dist"));

if (process.env.NODE_ENV !== "test") {
  app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
  });
}

export default app;
