const express = require('express');
const { protect } = require('./../controllers/authController');
const reviewController = require('../controllers/reviewController');
const {
  attachBusinessId,
  getForBusiness,
} = require('../middlewares/reviewMiddleware');
const router = express.Router();

// Use business slug to get reviews for business and create reviews for business
router
  .route('/:business')
  .get(attachBusinessId, getForBusiness, reviewController.getAllReviews)
  .post(attachBusinessId, reviewController.createReview);

router.route('/').get(protect, reviewController.getAllReviews);
router.route('/:id').get(reviewController.getSingleReview);

module.exports = router;
