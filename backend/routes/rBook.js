const express = require("express");
const router = express.Router();
const control = require("../controllers/cBook");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");

router.get('/', control.readAll);
router.get('/bestrating', control.bestRating);
router.post('/', auth, multer, control.updateAll);
router.get('/:id', control.readOne);
router.put('/:id', auth, multer, control.updateOne);
router.delete('/:id', auth, control.delOne);
router.post('/:id/rating', auth, control.rating);

module.exports = router;