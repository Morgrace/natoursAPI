import { User } from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
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

export const updateMe = catchAsync(async function (req, res, next) {
  //create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Pleause use /updateMyPassword',
        400,
      ),
    );
  }
  //filtered out unwanted fields;
  const filteredBody = filterObj(req.body, 'name', 'email');
  //Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async function (req, res, next) {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
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
