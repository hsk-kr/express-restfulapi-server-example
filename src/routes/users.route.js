import express from 'express';
import {
  createUser,
  fetchUsers,
  fetchUser,
  updateUser,
  deleteUser,
  partialUpdateUser,
} from '../controllers/user.controller';

const router = express.Router();

router
  .route('/')
  .post(createUser)
  .get(fetchUsers);

router
  .route('/:id')
  .get(fetchUser)
  .put(updateUser)
  .delete(deleteUser)
  .patch(partialUpdateUser);

export default router;
