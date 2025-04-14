const EXPRESS = require("express");
const router = EXPRESS.Router();
const controller = require("../controllers/productsController")

router.get("/", controller.showProductPage);

module.exports = router;