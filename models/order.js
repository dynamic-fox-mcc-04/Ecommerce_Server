'use strict';
module.exports = (sequelize, DataTypes) => {
  // const Order = sequelize.define('Order', {

  // }, {});
  class Order extends sequelize.Sequelize.Model { }
  Order.init({
    amount: {
      type: DataTypes.INTEGER
    },
    order_date: DataTypes.DATE,
    order_status: DataTypes.BOOLEAN,
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    }
  }, {
    hooks: {
      beforeCreate: (instance, options) => {
        instance.order_date = new Date()
      }
    },
    sequelize,
    modelName: 'Order'
  })
  Order.associate = function (models) {
    // associations can be defined here
    Order.belongsTo(models.User)
    Order.belongsToMany(models.Product, { through: 'ProductOrders' })
  };
  return Order;
};