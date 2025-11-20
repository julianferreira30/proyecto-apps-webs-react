import express from 'express';
import {addReview} from '../controllers/review';
import {withUser} from '../utils/middleware';

const router = express.Router();

router.post("/", withUser, addReview);

export default router;