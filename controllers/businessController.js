const Business = require('../models/businessModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');


exports.getAllBusinesses = factory.getAll(Business);
exports.getSingleBusiness = factory.getOne(Business);
exports.createBusiness = factory.createOne(Business);
exports.updateBusiness = factory.updateOne(Business);
exports.deleteBusiness = factory.deleteOne(Business);



exports.businessSearch = catchAsync(async (req, res, next) => {
  // Extract search parameters from the request query
  const { services, businessCategory, businessName, location } = req.query;
  
  // Construct the filter object based on the provided search parameters
  const filter = {};

  if (services) {
      filter.services = { $in: services.split(',') }; // Search for businesses with any of the provided services
  }
  if (businessCategory) {
      filter.businessCategory = new RegExp(businessCategory, 'i'); // Search for businesses matching the provided category
  }
  if (businessName) {
      filter.businessName = new RegExp(businessName, 'i'); // Search for businesses with a name matching the provided query
  }
  if (location) {
      filter.location = new RegExp(location, 'i'); // Search for businesses located in the provided location
  }

  // Query the database to find businesses matching the search criteria
  const businesses = await Business.find(filter);

  // Paginate the results
  let { page, limit } = req.query;
  page = page ? page * 1 : 1;
  limit = limit ? limit * 1 : 10;

  // Calculate the total number of pages based on the total count of documents
  const count = await Business.countDocuments(filter);
  const total = Math.ceil(count / limit);

  // Send the response with the search results
  res.status(200).json({
    status: 'success',
    results: businesses.length,
    total_pages: total,
    next_page: page < total ? page + 1 : null,
    prev: page > 1 ? page - 1 : null,
    data: businesses,
  });
});
