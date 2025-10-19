import express from "express";
import User from "../models/users";
import { withUser } from "../utils/middleware";

const router = express.Router();

router.post("/favorites", withUser, async (request, response) => {
  const userId = request.userId;
  const { gameId } = request.body;
  if (!userId || !gameId) {
    return response.status(400).json({ error: "Faltan datos requeridos" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
        return response.status(404).json({ error: "Usuario no encontrado" });
    }

    if (!user.favourites.includes(gameId)) {
      user.favourites.push(gameId);
      await user.save();
    }
    await user.populate("favourites wishlist")
    response.status(200).json({ favourites: user.favourites, wishlist:user.wishlist });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Error al agregar a favoritos" });
  }
});
router.post("/wishlist", withUser, async (request, response) => {
  const userId = request.userId;
  const { gameId } = request.body;

  if (!userId || !gameId) {
    return response.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
        return response.status(404).json({ error: "Usuario no encontrado" });
    }

    if (!user.wishlist.includes(gameId)) {
      user.wishlist.push(gameId);
      await user.save();
    }
    await user.populate("favourites wishlist")
    response.status(200).json({ favourites: user.favourites, wishlist:user.wishlist });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Error al agregar a wishlist" });
  }
});


router.delete("/favorites/:gameId", withUser, async (request, response) => {
  const userId = request.userId;
  const { gameId } = request.params;

  if (!userId || !gameId) {
    return response.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
        return response.status(404).json({ error: "Usuario no encontrado" });
    }
    user.favourites = user.favourites.filter((id) => id.toString() !== gameId);
    await user.save();
    await user.populate("favourites wishlist")
    response.status(200).json({ favourites: user.favourites, wishlist:user.wishlist });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Error al quitar de favoritos" });
  }
});
router.delete("/wishlist/:gameId", withUser, async (request, response) => {
  const userId = request.userId;
  const { gameId } = request.params;

  if (!userId || !gameId) {
    return response.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
        return response.status(404).json({ error: "Usuario no encontrado" });
    }

    user.wishlist = user.wishlist.filter((id) => id.toString() !== gameId);
    await user.save();
    await user.populate("favourites wishlist")
    response.status(200).json({ favourites: user.favourites, wishlist:user.wishlist });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Error al quitar de wishlist" });
  }
});

export default router;