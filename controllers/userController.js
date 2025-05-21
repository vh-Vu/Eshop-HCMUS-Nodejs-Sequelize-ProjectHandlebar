const userController = {}
const { where } = require("sequelize");
const models = require("../models")
userController.checkout = async(req,res) =>{
    if(req.session.cart.quantity == 0)   {res.redirect("/products"); return}
    const userId = 1;
    res.locals.addresses = await models.Address.findAll({where:{userId}});
    res.locals.cart = req.session.cart.getCart();
    res.render("checkout");
}


userController.placeOrders = async(req,res) =>{
    //const {addressId,payment} = req.body;
    const addressId = isNaN(req.body.addressId) ? 0 : parseInt(req.body.addressId);
    const address = await models.Address.findByPk(addressId);
    if (!address)
        address = await models.Address.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobile: req.body.mobile,
            address: req.body.address,
            country: req.body.country,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
            isDefault: req.body.isDefault
        });
    let cart = req.session.cart;
    cart.paymentMethod = req.body.payment;
    cart.shippingAddress = `${address.firstName} ${address.lastName}, Email: ${address.email}, Mobile: ${address.mobile}, Address: ${address.address}, ${address.city}, ${address.country}, ${address.state}, ${address.zipcode}`;
    let paymentMethod = "PAID";
    if(req.body.payment=="COD"){
        paymentMethod="UNPAID";
    }
    saveOrders(req,res,paymentMethod);
}

async function saveOrders(req,res,status) {
    const userId = 1;
    const {items,...other} = req.session.cart.getCart();
    const order = await models.Order.create({
        ...other,
        status,
        userId
    });
    const orderDetail = [];
    items.forEach(item => orderDetail.push({
        quantity: item.quantity,
        price: item.product.price,
        total: item.total,
        productId: item.product.id,
        orderId: order.id
    }));
    await models.OrderDetail.bulkCreate(orderDetail);
    req.session.cart.clear();
    return res.render("error",{message: "Thank you for your order!"});
}

userController.myAccount = (req,res) => res.render("my-account");


module.exports = userController;