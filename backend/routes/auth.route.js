import { signup,logout,login } from '../controllers/auth.controller.js';
import express from 'express'

const router = express.Router();

router.post('/signUp',signup)
router.post('/login',login)
router.post('/logout',logout)

export default router;