const express = require("express");
const router = express.Router();
const authenController = require("../controllers/authenController");

router.get("/login",authenController.show);
router.post("/login",authenController.login);
//router.post("/register",authenController.register);

module.exports = router;