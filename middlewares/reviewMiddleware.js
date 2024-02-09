const catchAsync = require('../utils/catchAsync');
const Business = require('../models/businessModel');

exports.attachBusinessId = catchAsync(async (req, res, next) => {
  const business = await Business.findOne({ slug: req.params.business });

  // Attach business id
  req.body.business = business._id;
  next();
});

exports.getForBusiness = catchAsync(async (req, res, next) => {
  req.query.business = req.body.business;
  next();
});
