const EXPRESS = require("express");
const router = EXPRESS.Router();
const ProductController = require("../controllers/productsController")

router.use(ProductController.init);
router.get("/", ProductController.showProductPage);
router.get("/:id", ProductController.showDetailPage);

module.exports = router;