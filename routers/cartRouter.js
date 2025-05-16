const EXPRESS = require("express");
const router = EXPRESS.Router();
const cartController = require("../controllers/cartController");

router.get("/", cartController.showPage);

module.exports = router;