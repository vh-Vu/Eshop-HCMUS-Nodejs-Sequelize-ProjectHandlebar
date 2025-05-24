const cartController = {};
const models = require("../models")

cartController.add = async(req,res) => {
    const id = isNaN(req.body.id) ? 0: parseInt(req.body.id);
    const quantity = isNaN(req.body.quantity) ? 0: parseInt(req.body.quantity);
    const product  = await models.Product.findByPk(id);
    if(product && quantity > 0){
        req.session.cart.add(product,quantity);
    }
    return res.json({quantity: req.session.cart.quantity});
}

cartController.showPage = (req,res) => {
    res.locals.cart = req.session.cart.getCart();
    res.render("cart");
}

cartController.update = (req,res) => {
    const id = isNaN(req.body.id) ? 0: parseInt(req.body.id);
    const quantity = isNaN(req.body.quantity) ? 0: parseInt(req.body.quantity);
    if(quantity > 0){
        const items = req.session.cart.update(id,quantity);
        return res.json({
            items,
            quantity: req.session.cart.quantity,
            subtotal: req.session.cart.subtotal,
            total: req.session.cart.total
        })
    }
    return res.sendStatus(204).end();

}

cartController.remove = (req,res) => {
    const id = isNaN(req.body.id) ? 0: parseInt(req.body.id);
    req.session.cart.remove(id);
    return res.json({
        quantity: req.session.cart.quantity,
        subtotal: req.session.cart.subtotal,
        total: req.session.cart.total
    })
}


cartController.clear = (req,res) =>{
    req.session.cart.clear();
    return res.sendStatus(200).end();
}

module.exports = cartController;