import express from 'express';

import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { login, signup } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// this follows the REST philosophy
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
