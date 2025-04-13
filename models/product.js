'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Brand,{foreignKey: "brandId"});
      Product.hasMany(models.Image,{foreignKey: "productId"});
      Product.belongsToMany(models.Tag,{
        through : "ProductTag", 
        foreignKey: "productId", 
        otherKey : "tagId"
      });
      Product.hasMany(models.Review,{foreignKey: "productId"});
      Product.belongsToMany(models.User,{through: "Wishlist", foreignKey: "productId", otherKey: "userId"});
    }
  }
  Product.init({
    name: DataTypes.STRING,
    imagePath: DataTypes.STRING,
    oldPrice: DataTypes.DECIMAL,
    price: DataTypes.DECIMAL,
    summary: DataTypes.TEXT,
    description: DataTypes.TEXT,
    stars: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};