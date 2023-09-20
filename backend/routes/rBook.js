const express = require("express");
const router = express.Router();
const control = require("../controllers/cBook");
const auth = require("../middleware/auth");

router.get('/', control.readAll);
router.post('/', auth, control.updateAll);

module.exports = router;