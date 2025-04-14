const controller = {};
const models = require("../models");
const Brands = models.Brand;
const Categories = models.Category;
const Products = models.Product; 
const Pages = require("../config/page");




controller.showHomePage = async(req,res) => {
    const P = await Products.findAll({
        attributes: ["id","name","imagePath","price","oldPrice","stars"],
        order: [["stars","DESC"]],
        limit: 10
    })
    res.locals.featuredProduct = P;
    res.locals.Brand = await Brands.findAll();
    const categories = await Categories.findAll();
    const second = categories.splice(2,2);
    const third = categories.splice(1,1);
    res.locals.Categories = [categories,second,third];

    res.render("index");
};

controller.showPage = (req,res,next) =>{
    if(Pages.has(req.params.page)){
        res.locals.page = req.params.page;
        res.render(req.params.page);
    }else   next();
}

module.exports = controller;