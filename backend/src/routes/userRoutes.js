import express from 'express';
import { authUser, registerUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/', registerUser); // Public for now to seed admin
router.post('/login', authUser);

export default router;
