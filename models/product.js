'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: 
    {
      allowNull: false,
      type : DataTypes.STRING
    },
    image_url: 
    {
      type : DataTypes.STRING,
      validate :
        {
          isUrl : true
        }
    },
    price: 
    {
      allowNull: false,
      type : DataTypes.INTEGER,
      validate :
        {
          isInt : true,
          min : 0
        }
    },
    stock: 
    {
      allowNull: false,
      type : DataTypes.INTEGER,
      validate :
        {
          isNumeric : true,
          min : 0
        }
    },
    description: DataTypes.TEXT,
    UserId: DataTypes.INTEGER
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsToMany(models.User, {through : "Orders"});
    Product.belongsTo(models.User);
  };
  return Product;
};