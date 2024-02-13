const mongoose = require('mongoose');
const Business = require('./businessModel');
const reviewSchema = new mongoose.Schema(
  {
    reviewerName: {
      type: String,
      required: [true, "Reveiwer's name should be provided"],
    },
    business: {
      type: mongoose.Schema.ObjectId,
      ref: 'Business',
      required: [true, 'Business being reviewed should be provided'],
    },
    selectedService: {
      type: String,
      required: [true, 'Reviewer must review a service'],
    },
    reviewText: {
      type: String,
    },
    ratings: {
      type: Number,
      required: [true, 'Ratings must be included'],
      min: 0,
      max: 5,
    },
  },
  {
    strict: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },

    timestamps: true,
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate('business');
  next();
});
reviewSchema.statics.calcAverageRating = async function (businessId) {
  const aggregationResult = await Review.aggregate([
    {
      $match: {
        business: businessId,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$ratings' },
      },
    },
  ]);

  const averageRating =
    (aggregationResult[0] && aggregationResult[0].averageRating) || 0;

  await Business.findByIdAndUpdate(businessId, { averageRating });
};
reviewSchema.statics.calcReviewCount = async function (id) {
  const reviewCount = await this.countDocuments({ business: id });

  await Business.findByIdAndUpdate(
    id,
    {
      reviewCount,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};
reviewSchema.post('save', async function (doc) {
  await this.constructor.calcReviewCount(doc.business);
  await this.constructor.calcAverageRating(doc.business);
});

const Review = mongoose.model('Review', reviewSchema, 'reviews');

module.exports = Review;
