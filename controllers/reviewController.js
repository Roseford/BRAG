const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = factory.getAll(Review);
exports.getSingleReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
