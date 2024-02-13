const Business = require('../models/businessModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');


exports.getAllBusinesses = factory.getAll(Business);
exports.getSingleBusiness = factory.getOne(Business);
exports.createBusiness = factory.createOne(Business);
exports.updateBusiness = factory.updateOne(Business);
exports.deleteBusiness = factory.deleteOne(Business);



exports.businessSearch = catchAsync(async (req, res, next) => {
  // Extracting search query from URL params
  const { query } = req.params;
  
  // Constructing filter to match any occurrence of the query letter in name or organisation
  const filter = {
    $or: [
      { businessName: new RegExp(query, "i") },
      { services: new RegExp(query, "i") },
      { location: new RegExp(query, "i") },
      { businessCategory: new RegExp(query, "i") }
    ]
  };

  // Fetching forms based on constructed filter
  const businesses = await Business.find(filter);

  // Pagination logic
  let { page, limit } = req.query;
  page = page ? page * 1 : 1;
  limit = limit ? limit * 1 : 10;

  // Excluding pagination fields from query object
  const excludedFields = ["page", "sort", "limit", "fields"];
  const queryObj = { ...req.query, page, limit };
  excludedFields.forEach((el) => delete queryObj[el]);

  // Advanced Filtering
  const count = await Business.countDocuments(filter);
  const total = Math.ceil(count / limit);

  // Sending response
  res.status(200).json({
    status: "success",
    results: businesses.length,
    total_pages: total,
    next_page: page < total ? page + 1 : null,
    prev: page > 1 ? page - 1 : null,
    doc: businesses,
  });
});
