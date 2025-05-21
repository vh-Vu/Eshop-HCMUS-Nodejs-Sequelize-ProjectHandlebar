const EXPRESS = require("express");
const router = EXPRESS.Router();
const ProductController = require("../controllers/productsController");
const cartController = require("../controllers/cartController");

router.use(ProductController.init);
router.get("/", ProductController.showProductPage);
router.get("/cart",cartController.showPage);
router.delete("/cartall",cartController.clear);
router.get("/:id", ProductController.showDetailPage);
router.post("/cart",cartController.add);
router.put("/cart",cartController.update);
router.delete("/cart",cartController.remove);

module.exports = router;