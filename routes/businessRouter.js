const express = require('express');
const authController = require('./../controllers/authController');
const businessController = require('../controllers/businessController')
const businessMiddleware = require('../middlewares/businessMiddleware')
const upload = require('./../utils/multer')

const router = express.Router();

router.get('/getAllBusinesses', authController.protect, businessController.getAllBusinesses);
router.get('/:id', authController.protect, businessController.getSingleBusiness);

router.post('/createBusiness', 
authController.protect,
businessMiddleware.attachUserId, 
upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'image' }
]),
businessMiddleware.uploadAndParseReq,
businessController.createBusiness);

router.patch('/:id', authController.protect, 
upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'image' }
]),
businessMiddleware.uploadAndParseReq,
businessController.updateBusiness);

router.get('/search', businessController.businessSearch);

router.delete('/:id', authController.protect, businessController.deleteBusiness);


module.exports = router