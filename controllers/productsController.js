const controller = {};
const models = require("../models");
const Products = models.Product;
const Categories = models.Category;

controller.showProductPage = async(req,res) =>{
    res.locals.categories = await Categories.findAll(
        {
        include: [{model: Products, attributes : ["id"]}]
    });
    console.log(res.locals.categories);
    res.locals.products = await Products.findAll({
        attributes: ["id","name","imagePath","price","oldPrice","stars"]
    })
    res.render("product-list");
}

module.exports = controller;