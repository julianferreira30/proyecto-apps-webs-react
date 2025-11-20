import { Request, Response, NextFunction } from "express";
import Game from "../models/game";
import User from "../models/users";
import {
  validateInputGenre,
  validateInputNumber,
  validateInputString,
  validateInputStringImage,
} from "../utils/validations";
import mongoose from "mongoose";

export const getAllGames = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const games = await Game.find({});
    return response.status(201).json(games.reverse());
  } catch (error) {
    next(error);
  }
};

export const getGameById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.params;
    const game = await Game.findById(id);
    if (game) {
      await game.populate(["reviews"]);
      return response.status(201).json(game);
    } else {
      return response
        .status(404)
        .json({ error: "No se pudo encontrar el juego con ese id" })
        .end();
    }
  } catch (error) {
    next(error);
  }
};

export const addGame = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(request.userId);
    if (!user) {
      return response
        .status(401)
        .json({ error: "Solo un usuario autenticado puede agregar un juego" });
    }

    const body = request.body;
    const creator = body.creator
      ? validateInputString(body.creator, 1, 100)
        ? body.creator.trim()
        : ""
      : undefined;
    if (
      !validateInputString(body.name, 1, 100) ||
      !validateInputNumber(body.release_year, 1972, new Date().getFullYear()) ||
      !validateInputGenre(body.genre) ||
      !validateInputStringImage(body.image) ||
      !validateInputString(body.description, 1, 500) ||
      creator === ""
    ) {
      return response
        .status(400)
        .json({ error: "Faltan datos o no son del tipo correcto" });
    }

    const game = new Game({
      name: body.name.trim(),
      release_year: body.release_year,
      creator,
      genre: body.genre,
      image: body.image.trim(),
      description: body.description.trim(),
    });
    await game.save();

    if (!user.added.includes(game._id)) {
      user.added.splice(0, 0, game._id);
      await user.save();
    }

    return response.status(201).json(game);
  } catch (error) {
    next(error);
  }
};

export const setGame = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(request.userId);
    if (!user) {
      return response
        .status(401)
        .json({
          error:
            "Solo un usuario autenticado puede cambiar atributos de un juego",
        });
    }

    const id = request.params.id;
    const objectId = new mongoose.Types.ObjectId(id);
    const body = request.body;
    if (!user.added.includes(objectId)) {
      return response
        .status(401)
        .json({
          error:
            "Solo un usuario que haya agregado ese juego puede cambiar sus atributos",
        });
    }

    if (
      !(
        body.name ||
        body.release_year ||
        body.creator ||
        body.genre ||
        body.image ||
        body.description
      )
    ) {
      return response
        .status(400)
        .json({ error: "Al menos un campo es requerido" });
    }
    if (body.rating || body.rating === 0 || body.reviews) {
      return response
        .status(400)
        .json({ error: "No es posible cambiar estos campos" });
    }
    const name = body.name
      ? validateInputString(body.name, 1, 100)
        ? body.name.trim()
        : ""
      : undefined;
    const release_year = body.release_year
      ? validateInputNumber(body.release_year, 1972, new Date().getFullYear())
        ? body.release_year
        : ""
      : undefined;
    const creator = body.creator
      ? validateInputString(body.creator, 1, 100)
        ? body.creator.trim()
        : ""
      : undefined;
    const genre = body.genre
      ? validateInputGenre(body.genre)
        ? body.genre
        : ""
      : undefined;
    const image = body.image
      ? validateInputStringImage(body.image)
        ? body.image.trim()
        : ""
      : undefined;
    const description = body.description
      ? validateInputString(body.description, 150, 500)
        ? body.description.trim()
        : ""
      : undefined;
    if (
      name === "" ||
      release_year === "" ||
      creator === "" ||
      genre === "" ||
      image === "" ||
      description === ""
    ) {
      return response
        .status(400)
        .json({ error: "Los datos enviados no son del tipo correcto" });
    }

    const newBody = {
      name: name,
      release_year: release_year,
      creator: creator,
      genre: genre,
      image: image,
      description: description,
    };
    const game = await Game.findByIdAndUpdate(id, newBody, { new: true });
    if (game) {
      return response.status(200).json(game);
    } else {
      return response
        .status(404)
        .json({ error: "No se pudo encontrar el juego con ese id" })
        .end();
    }
  } catch (error) {
    next(error);
  }
};
