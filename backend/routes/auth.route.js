import { signup,logout,login } from '../controllers/auth.controller';
import express from 'express'

const router = express.Router();

router.get('/signUp',signup)
router.get('/login',login)
router.get('/logout',logout)

export default router;