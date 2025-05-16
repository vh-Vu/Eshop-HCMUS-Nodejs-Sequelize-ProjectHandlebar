const EXPRESS = require("express");
const router = EXPRESS.Router();
const ProductController = require("../controllers/productsController");
const cartController = require("../controllers/cartController");

router.use(ProductController.init);
router.get("/", ProductController.showProductPage);
router.get("/:id", ProductController.showDetailPage);
router.post("/cart",cartController.add)

module.exports = router;