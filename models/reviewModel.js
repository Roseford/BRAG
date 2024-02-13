const mongoose = require('mongoose');

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
reviewSchema.statics.calcReviewCount = async function (id) {
  const formsCount = await this.count({ business: id });

  await Organisation.findByIdAndUpdate(
    id,
    {
      formsCount,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

const Review = mongoose.model('Review', reviewSchema, 'reviews');

module.exports = Review;
