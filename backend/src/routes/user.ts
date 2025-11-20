import express from 'express';
import {addToFavorites, addToWhislist, addToPlayed, deleteFromFavorites, deleteFromWhislist, deleteFromPlayed} from '../controllers/users';
import {withUser} from '../utils/middleware';

const router = express.Router();

router.post("/favorites", withUser, addToFavorites);
router.post("/wishlist", withUser, addToWhislist);
router.post("/played", withUser, addToPlayed);
router.delete("/favorites/:gameId", withUser, deleteFromFavorites);
router.delete("/wishlist/:gameId", withUser, deleteFromWhislist);
router.delete("/played/:gameId", withUser, deleteFromPlayed);


export default router;