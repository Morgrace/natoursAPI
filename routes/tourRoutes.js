import express from 'express';

import {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  // checkBody,
} from '../controllers/tourController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

//middle for the tour routes; checks if id is valid
// router.param('id', checkID);middleware for params

// router.route('/').get(getAllTours).post(checkBody, createTour); //middleware can be passed as the first arg before the controller fns

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/').get(protect, getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

export default router;
