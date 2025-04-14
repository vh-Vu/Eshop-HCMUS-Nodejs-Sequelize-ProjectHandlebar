const EXPRESS = require("express");
const router = EXPRESS.Router();
const controller = require("../controllers/productsController")

router.use(controller.init);
router.get("/", controller.showProductPage);
router.get("/:id", controller.showDetailPage);

module.exports = router;