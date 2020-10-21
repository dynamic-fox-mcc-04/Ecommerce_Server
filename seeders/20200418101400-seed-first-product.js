'use strict';

let product = [{
  name: 'Laptop Dell G7 15',
  image_url: 'https://cf.shopee.co.id/file/4c1d8680cadb3dd7ee99fda9ec3893b9',
  price: 20000000,
  stock: 3,
  createdAt: new Date(),
  updatedAt: new Date()
}]
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkInsert('Products', product, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkDelete('Products', null, {});
  }
};
