const controller = {};
const models = require("../models");
const Products = models.Product;
const Categories = models.Category;
const Brands = models.Brand;
const Tags = models.Tag;

controller.init = async(req,res,next) =>{

    res.locals.categories = await Categories.findAll(
        {
        include: [{model: Products, attributes : ["id"]}]
    });

    res.locals.brands = await Brands.findAll({
        include: [{model: Products, attributes : ["id"]}]
    });

    res.locals.tags = await Tags.findAll();

    next();
}

controller.showProductPage = async(req,res) =>{
    

    res.locals.products = await Products.findAll({
        attributes: ["id","name","imagePath","price","oldPrice","stars"]
    })
    res.render("product-list");
}

controller.showDetailPage = async(req,res) => {
    res.render("product-detail");
}

module.exports = controller;