'use strict';
module.exports = (sequelize, DataTypes) => {
  // const ProductOrder = sequelize.define('ProductOrder', {
  //   total_price: DataTypes.INTEGER,
  //   quantity: DataTypes.INTEGER,
  //   OrderId: DataTypes.INTEGER,
  //   ProductId: DataTypes.INTEGER
  // }, {});
  class ProductOrder extends sequelize.Sequelize.Model { }
  ProductOrder.init({
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    OrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: sequelize.Sequelize.Order,
        key: 'id'
      }
    },
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: sequelize.Sequelize.Product,
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ProductOrder'
  })
  ProductOrder.associate = function (models) {
    // associations can be defined here
    ProductOrder.belongsTo(models.Order)
    ProductOrder.belongsTo(models.Product)
  };
  return ProductOrder;
};