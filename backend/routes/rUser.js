const express = require("express");
const router = express.Router();
const control = require("../controllers/cUser");

router.post('/login', control.login);
router.post('/signup', control.signup);

module.exports = router;