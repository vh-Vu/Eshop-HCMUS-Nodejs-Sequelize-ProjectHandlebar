const ProductController = {};
const sequelize = require("sequelize");
const models = require("../models");
const Products = models.Product;
const Categories = models.Category;
const Brands = models.Brand;
const Tags = models.Tag;
const simpleParser = (defau,value) => isNaN(value) ? defau : parseInt(value);


//right column
ProductController.init = async(req,res,next) =>{

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

ProductController.showProductPage = async(req,res) =>{
    let options = {
        attributes : ["id","name","imagePath","price","oldPrice","stars"],
        include: [],
        where: {},
    };

    let {category, tag, brand, keyword="",page,sort} = req.query;
    sort = ["price","newest","popular"].includes(sort) ? sort: "price";
    category = simpleParser(0,category);
    if(category)  options.where.categoryId = category;

    tag = simpleParser(0,tag);
    if(tag)  options.include.push({model: Tags, where:{ id: tag}});

    brand = simpleParser(0,brand);
    if(brand)  options.where.brandId = brand;
    if (keyword.trim()!=""){
        options.where.name = {
            [sequelize.Op.iLike] : `%${keyword}%`
        };
        res.locals.keyword = keyword;
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
    res.locals.URL = {
        price: new URLSearchParams({...req.query,sort:"price"}).toString(),
        newest: new URLSearchParams({...req.query,sort:"newest"}).toString(),
        popular: new URLSearchParams({...req.query,sort:"popular"}).toString(),
    };
    page = Math.max(1,simpleParser(1,page));
    const limit = 6;
    options.limit = limit;
    options.offset = (page-1)*limit;;
   

    let {rows,count} = await Products.findAndCountAll(options);

    res.locals.products = rows;
    res.render("product-list", { 
        sort,
        pagination: { 
            page, 
            limit,
            totalRows: count, 
            queryParams: req.query }
        }
    );
}

ProductController.showDetailPage = async(req,res) => {

    let id  = simpleParser(0,req.params.id);
    const product = await Products.findByPk(id,{
        include : [
            {model: models.Image, attributes: ["name","imagePath"]},
            {model: models.Review, attributes: ["review", "stars","createdAt"],
                include:[
                    {model: models.User, attributes: ["id","firstName","lastName"]}
                ]},
            {model: Tags, attributes: ["id"]}
        ]
    });
    if(!product) return res.status(404).render("error", {message: "File not found!"});
    res.locals.product = product;
    if(product.Tags){
        const tagIDs = [];
        product.Tags.forEach(tag => tagIDs.push(tag.id));

        res.locals.relations = await Products.findAll({
            include:[
                {model: Tags, attributes: ["id"], where: {id: {[sequelize.Op.in]:tagIDs}}}
            ],
            where: {id: {[sequelize.Op.ne] : id}}
        })    
    }
    res.render("product-detail");
};

module.exports = ProductController;