const Business = require('../models/businessModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');


exports.getAllBusinesses = factory.getAll(Business);
exports.getSingleBusiness = factory.getOne(Business);
exports.createBusiness = factory.createOne(Business);
exports.updateBusiness = factory.updateOne(Business);
exports.deleteBusiness = factory.deleteOne(Business);

exports.businessNameSearch = catchAsync(async (req, res, next) => {
    const { businessName } = req.params;
    const filter = {
      'details.Full Name': new RegExp(businessName, 'i'),
    };
    const businesses = await Business.find(filter);
  
    let { page, limit } = req.query;
    page = page ? page * 1 : 1;
    limit = limit ? limit * 1 : 10;
    const queryObj = { ...req.query, page: page * 1, limit: limit * 1 };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
  
    excludedFields.forEach((el) => delete queryObj[el]);
  
    // 1B)Advanced Filtering
  
    const count = await Business.count(filter);
  
    const total = Math.ceil(count / limit);
  
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: businesses.length,
      total_pages: total,
      next_page: page * 1 < total ? page * 1 + 1 : null,
      prev: page * 1 > 1 ? page * 1 - 1 : null,
      doc: businesses,
    });
  });

  exports.businessCategorySearch = catchAsync(async (req, res, next) => {
    const { businessCategory } = req.params;
    const filter = {
      'details.Full Name': new RegExp(businessCategory, 'i'),
    };
    const businesses = await Business.find(filter);
  
    let { page, limit } = req.query;
    page = page ? page * 1 : 1;
    limit = limit ? limit * 1 : 10;
    const queryObj = { ...req.query, page: page * 1, limit: limit * 1 };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
  
    excludedFields.forEach((el) => delete queryObj[el]);
  
    // 1B)Advanced Filtering
  
    const count = await Business.count(filter);
  
    const total = Math.ceil(count / limit);
  
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: businesses.length,
      total_pages: total,
      next_page: page * 1 < total ? page * 1 + 1 : null,
      prev: page * 1 > 1 ? page * 1 - 1 : null,
      doc: businesses,
    });
  });