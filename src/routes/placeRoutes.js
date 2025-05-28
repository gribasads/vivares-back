const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const { upload } = require('../config/s3');
const auth = require('../middleware/auth');

// Rotas para lugares
router.post('/', auth, upload.array('images', 5), placeController.createPlace);
router.get('/', placeController.getPlaces);
router.get('/:id', placeController.getPlace);
router.put('/:id', auth, upload.array('images', 5), placeController.updatePlace);
router.delete('/:id', auth, placeController.deletePlace);
router.delete('/:id/image', auth, placeController.removeImage);

module.exports = router; 