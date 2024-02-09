const mongoose = require('mongoose');
const validator = require('validator');
const businessSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'A business must have a user'],
        },

        logo: {
            type: {
                logoUrl: String,
                publicId: String,
            },
        },

        image: {
            type: [{
                imgUrl: String,
                pubblicId: String
            }]
        },

        businessName: {
            type: String,
            required: [true, 'Business name is reqired']
        },

        businessMail: {
            type: String,
            required: [true, 'Business mail is required'],
            unique: [true, 'Email is already in use'],
            validate: [validator.isEmail, 'Email provided must be a valid email address'],
        },
        
        services: {
            type: Array,
            required: [true, 'Services are required'],
        },

        phoneNumber: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: [true, 'Phone number has been used before']
        },

        location: {
            type: String,
            required: [true, 'Location is required'],
        },

        businessCategory: {
            type: String,
            enum: ['Beauty products', 'Hair and makeup', 'Snacks', 'Clothings', 'Restaurant', 'Entertainment', 'Accessories', 'Services', 'Others'],
            required: [true, 'Business category is required'],
        },

        daysOfOperation: {
            type: [String],
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: [true, 'Days of Operation are required'],
        },

        hoursOfOperation: {
            type: [String],
            enum: ['1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm', '12pm'],
            required: [true, 'Hours of operation are required'],
        },

        instagram: {
            type: String,
        },

        twitter: {
            type: String,
        },

        facebook: {
            type: String,
        }
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

businessSchema.post('save', async function () {});

const Business = mongoose.model('Business', businessSchema, 'businesses');

module.exports = Business;