import express from 'express';
import {getAllGames, getGameById, addGame, setGame} from '../controllers/game';
import { withUser } from '../utils/middleware';

const router = express.Router();

router.get("/", getAllGames);
router.get("/:id", getGameById);
router.post("/", withUser, addGame);
router.put("/:id", withUser, setGame);

export default router;