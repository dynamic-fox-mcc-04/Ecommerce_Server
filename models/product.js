'use strict';
module.exports = (sequelize, DataTypes) => {
  class Product extends sequelize.Sequelize.Model { }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `The name of products is required`
        },
        notEmpty: {
          msg: `The name of products must not be an empty string`
        }
      }
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `The image_url is required`
        },
        notEmpty: {
          msg: `The image_url must not be an empty string`
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: `price is required`
        },
        min: {
          args: 2000,
          msg: 'price must be IDR 2000 or higher'
        },
        max: {
          args: 25000000,
          msg: 'price maximum is IDR 25000000'
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: `stock is required`
        },
        isPosiive(value) {
          if (value <= 0) { //try to make another version custom validation
            throw new Error("stock must be positive");
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Product'
  })
  Product.associate = function (models) {
    // associations can be defined here
    Product.belongsToMany(models.Order, { through: 'ProductOrders' })
  };
  return Product;
};