import { Request, Response, NextFunction } from 'express';
import User from "../models/users";
import GameModel from "../models/game";
import ReviewModel from '../models/review';

export const addToFavorites = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const userId = request.userId;
    if (!userId) {
      return response.status(401).json({ error: "Solo un usuario autenticado puede agregar un juego a favoritos" });
    }

    const { gameId } = request.body;
    if (!gameId) {
      return response.status(400).json({ error: "Faltan datos" });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
          return response.status(404).json({ error: "Usuario no encontrado" });
      }

      const game = await GameModel.findById(gameId);
      if (!game) {
        return response.status(404).json({ error: "Juego no encontrado" });
      }

      if (!user.favorites.includes(gameId)) {
        user.favorites.splice(0, 0, gameId);
        await user.save();
      }
      await user.populate("favorites")
      return response.status(200).json(user.favorites);
    } catch (err) {
      console.error(err);
      return response.status(500).json({ error: "Error al agregar a favoritos" });
    }
  } catch (error) {
    next(error)
  }
}

export const addToWhislist = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const userId = request.userId;
    if (!userId) {
      return response.status(401).json({ error: "Solo un usuario autenticado puede agregar un juego a wishlist" });
    }

    const { gameId } = request.body;
    if (!gameId) {
      return response.status(400).json({ error: "Faltan datos" });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
          return response.status(404).json({ error: "Usuario no encontrado" });
      }

      const game = await GameModel.findById(gameId);
      if (!game) {
        return response.status(404).json({ error: "Juego no encontrado" });
      }

      if (!user.wishlist.includes(gameId)) {
        user.wishlist.splice(0, 0, gameId);
        await user.save();
      }
      await user.populate("wishlist")
      return response.status(200).json(user.wishlist);
    } catch (err) {
      console.error(err);
      return response.status(500).json({ error: "Error al agregar a wishlist" });
    }
  } catch (error) {
    next(error)
  }
}

export const addToPlayed = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const userId = request.userId;
    if (!userId) {
      return response.status(401).json({ error: "Solo un usuario autenticado puede agregar un juego a jugados" });
    }

    const { gameId } = request.body;
    if (!gameId) {
      return response.status(400).json({ error: "Faltan datos" });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
          return response.status(404).json({ error: "Usuario no encontrado" });
      }

      const game = await GameModel.findById(gameId);
      if (!game) {
        return response.status(404).json({ error: "Juego no encontrado" });
      }

      if (!user.played.includes(gameId)) {
        user.played.splice(0, 0, gameId);
        await user.save();
      }
      await user.populate("played")
      return response.status(200).json(user.played);
    } catch (err) {
      console.error(err);
      return response.status(500).json({ error: "Error al agregar a jugados" });
    }
  } catch (error) {
    next(error)
  }
}

export const deleteFromFavorites = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const userId = request.userId;
    if (!userId) {
      return response.status(401).json({ error: "Solo un usuario autenticado puede eliminar un juego de favoritos" });
    }

    const { gameId } = request.params;
    if (!gameId) {
      return response.status(400).json({ error: "Faltan datos" });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
          return response.status(404).json({ error: "Usuario no encontrado" });
      }

      const game = await GameModel.findById(gameId);
      if (!game) {
        return response.status(404).json({ error: "Juego no encontrado" });
      }
      
      user.favorites = user.favorites.filter((id) => id.toString() !== gameId);
      await user.save();
      await user.populate("favorites")
      return response.status(200).json(user.favorites);
    } catch (err) {
      console.error(err);
      return response.status(500).json({ error: "Error al quitar de favoritos" });
    }
  } catch (error) {
    next(error)
  }
}

export const deleteFromWhislist = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const userId = request.userId;
    if (!userId) {
      return response.status(401).json({ error: "Solo un usuario autenticado puede eliminar un juego de wishlist" });
    }

    const { gameId } = request.params;
    if (!gameId) {
      return response.status(400).json({ error: "Faltan datos" });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
          return response.status(404).json({ error: "Usuario no encontrado" });
      }

      const game = await GameModel.findById(gameId);
      if (!game) {
        return response.status(404).json({ error: "Juego no encontrado" });
      }

      user.wishlist = user.wishlist.filter((id) => id.toString() !== gameId);
      await user.save();
      await user.populate("wishlist")
      return response.status(200).json(user.wishlist);
    } catch (err) {
      console.error(err);
      return response.status(500).json({ error: "Error al quitar de wishlist" });
    }
  } catch (error) {
    next(error)
  }
}

export const deleteFromPlayed = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const userId = request.userId;
    if (!userId) {
      return response.status(401).json({ error: "Solo un usuario autenticado puede eliminar un juego de jugados" });
    }

    const { gameId } = request.params;
    if (!gameId) {
      return response.status(400).json({ error: "Faltan datos" });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
          return response.status(404).json({ error: "Usuario no encontrado" });
      }

      const game = await GameModel.findById(gameId);
      if (!game) {
        return response.status(404).json({ error: "Juego no encontrado" });
      }

      const reviewed = await ReviewModel.exists({
        author: user._id,
        gameId: game._id.toString(),
      });

      if (reviewed) {
        return response.status(404).json({ error: "No se puede eliminar un juego de jugados porque ya hiciste una review" });
      }

      user.played = user.played.filter((id) => id.toString() !== gameId);
      await user.save();
      await user.populate("played");

      return response.status(200).json(user.played);
    } catch (err) {
      console.error(err);
      return response.status(500).json({ error: "Error al quitar de jugados" });
    }
  } catch (error) {
    next(error)
  }
}