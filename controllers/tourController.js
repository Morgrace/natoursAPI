import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Tour from '../models/tourModel.js';
import { APIFeatures } from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//middleware function
// export const checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };
// /api/v1/tours ... works with gte,lte,gt,lt filters using query string
//middleware
export const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  //this actually does not work the request object can't be mutated;

  next();
};
//controllers.

export const getAllTours = catchAsync(async (req, res, next) => {
  //Build query
  const queryStr = req.query;
  const features = new APIFeatures(Tour.find(), queryStr)
    .applyFilter()
    .applySort()
    .applyFieldLimiting()
    .applyPagination();
  //Execute query
  const tours = await features.query;
  //Send response
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: tours,
  });
});
export const getTour = catchAsync(async (req, res, next) => {
  //solution1
  // const tour = await Tour.findOne({_id: req.params.id})
  //solution 2
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

export const createTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({});solution 1
  // newTour.save().then()
  // solution 2
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newTour,
  });
});
export const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: tour,
  });
});
export const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
/**A function that returns basic statistic info about Tour document*/
// export const getTourStats = async (req, res) => {
//   try {
//     const stats = await Tour.aggregate([
//       {
//         $match: { ratingsAverage: { $gte: 4.5 } },
//       },
//       {
//         $group: {}
//       }
//     ]);
//   } catch (error) {
//     res.status(404).json({
//       status: 'fail',
//       message: error,
//     });
//   }
// };
