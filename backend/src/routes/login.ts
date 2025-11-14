import express from 'express';
import {login, getCurrentUser, logout} from '../controllers/login';
import {withUser} from '../utils/middleware';

const router = express.Router();

router.post("/", login);
router.get("/auth/me", withUser, getCurrentUser);
router.post("/logout", logout);

export default router;