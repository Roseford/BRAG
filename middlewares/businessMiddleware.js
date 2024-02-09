const catchAsync = require('../utils/catchAsync');
const cloudinary = require('../utils/cloudinary');
const User = require('../models/userModel')

exports.attachUserId = catchAsync(async (req, res, next) => {
    req.body.user = req.user.id;

    // Update the user model to set 'hasBusiness' to true
    await User.findByIdAndUpdate(req.user.id, { hasBusiness: true });

    next();
});

exports.uploadAndParseReq = catchAsync(async (req, res, next) => {
    // Upload Logo to Cloudinary (if present)
    if (req.files.logo && Array.isArray(req.files.logo) && req.files.logo.length > 0) {
        const logoResult = await cloudinary.uploader.upload(req.files.logo[0].path);
        req.body.logo = {
            logoUrl: logoResult.secure_url,
            publicId: logoResult.public_id,
        };
    }

    // Upload Images to Cloudinary (if present)
    if (req.files.image && Array.isArray(req.files.image) && req.files.image.length > 0) {
        const imageUploadPromises = req.files.image.map(async (imageFile) => {
            const imageResult = await cloudinary.uploader.upload(imageFile.path);
            return {
                imgUrl: imageResult.secure_url,
                publicId: imageResult.public_id,
            };
        });

        req.body.image = await Promise.all(imageUploadPromises);
    }

    next();
});
