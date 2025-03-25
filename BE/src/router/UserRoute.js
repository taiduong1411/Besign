const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");

router.post("/become-seller", UserController.becomeSeller);

module.exports = router;
