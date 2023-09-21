const express = require("express");
const router = express.Router();
const control = require("../controllers/cBook");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");

router.get('/', control.readAll);
router.post('/', auth, multer, control.updateAll);

module.exports = router;