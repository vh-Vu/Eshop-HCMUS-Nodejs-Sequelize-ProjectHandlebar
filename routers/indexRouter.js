"use strict";
const EXPRESS = require("express");
const router = EXPRESS.Router();
const controller = require("../controllers/indexController");


router.get("/",controller.showHomePage);

router.get("/:page",controller.showPage);


module.exports = router;