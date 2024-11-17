const express = require('express');
const roomTypeController = require('../controller/roomTypeController');
const router = express.Router();
const multer = require('multer');
const path = require('path');


// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/roomTypes')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post('/', upload.array('images', 5), roomTypeController.createRoomType);
router.post('/', roomTypeController.createRoomType);
router.get('/', roomTypeController.getRoomTypes);
router.get('/:id', roomTypeController.getRoomTypeById);
router.put('/:id', upload.array('images', 5), roomTypeController.updateRoomType);
router.put('/:id', roomTypeController.updateRoomType);
router.delete('/:id', roomTypeController.deleteRoomType);

module.exports = router;
