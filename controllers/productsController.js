const controller = {};
const sequelize = require("sequelize");
const models = require("../models");
const Products = models.Product;
const Categories = models.Category;
const Brands = models.Brand;
const Tags = models.Tag;
const simpleParser = (defau,value) => isNaN(value) ? defau : parseInt(value);


//right column
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
    const options = {
        attributes : ["id","name","imagePath","price","oldPrice","stars"],
        include: [],
        where: {}
    };
    let {category, tag, brand, keyword ="",sort,page } = req.query;
    sort = ["price","newest","popular"].includes(sort) ? sort: "price";
    category = simpleParser(0,category);
    if(category)  options.where.categoryId = category;

    tag = simpleParser(0,tag);
    if(tag)  options.include.push (
        {model: Tags, where:{ id: tag}}
    );
    brand = simpleParser(0,brand);
    if(brand)  options.where.brandId = brand;
    if (keyword.trim()!=""){
        options.where.name = {
            [sequelize.Op.iLike] : `%${keyword}%`
        };
    }

    switch(sort){
        case "price":
            options.order = [["price","ASC"]];
            break;
        case "newest":
            options.order = [["createdAt","DESC"]];
            break;
        default:
            options.order = [["stars","DESC"]];
    }

    res.locals.products = await Products.findAll(options);
    res.locals.URL = {
        price: new URLSearchParams({...req.query,sort:"price"}).toString(),
        newest: new URLSearchParams({...req.query,sort:"newest"}).toString(),
        popular: new URLSearchParams({...req.query,sort:"popular"}).toString(),

};

    res.render("product-list",{sort});
}

controller.showDetailPage = async(req,res) => {

    let id  = simpleParser(0,req.params.id);
    res.locals.product = await Products.findByPk(id,{
        include : [
            {model: models.Image, attributes: ["name","imagePath"]},
            {model: models.Review, attributes: ["review", "stars","createdAt"],
                include:[
                    {model: models.User, attributes: ["id","firstName","lastName"]}
                ]}
        ]
    });
    console.log(res.locals.product)
    res.render("product-detail");
}

module.exports = controller;