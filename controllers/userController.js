import { User } from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';

export const getAllUsers = catchAsync(async function (req, res, next) {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

export const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet undefined!',
  });
};
export const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet undefined!',
  });
};
export const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet undefined!',
  });
};
export const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet undefined!',
  });
};
