const cartController = {};
const models = require("../models")

cartController.add = async(req,res) => {
    const id = isNaN(req.body.id) ? 0: parseInt(req.body.id);
    const quantity = isNaN(req.body.quantity) ? 0: parseInt(req.body.quantity);
    const product  = await models.Product.findByPk(id);
    if(product){
        req.session.cart.add(product,quantity);
    }
    //req.session.cart.items.forEach(i => console.log(i));
    console.log(req.session.cart.items);
    return res.json({quantity: req.session.cart.quantity});
}

cartController.showPage = (req,res) => {
    console.log(req.session.cart.items);
    const productsInCart = [];
    Object.values(req.session.cart.items).forEach(items => productsInCart.push(items));
    res.locals.productsInCart = productsInCart;
    res.render("cart");
}


module.exports = cartController;