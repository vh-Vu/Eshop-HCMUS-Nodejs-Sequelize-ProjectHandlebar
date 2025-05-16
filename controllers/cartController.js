const cartController = {};
const models = require("../models")

cartController.add = async(req,res) => {
    console.log("test");
    const id = isNaN(req.body.id) ? 0: parseInt(req.body.id);
    const quantity = isNaN(req.body.quantity) ? 0: parseInt(req.body.quantity);
    const product  = await models.Product.findByPk(id);
    if(product){
        req.session.cart.add(product,quantity);
    }
    return res.json({quantity: req.session.cart.quantity});
}


module.exports = cartController;