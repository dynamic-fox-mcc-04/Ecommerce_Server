'use strict';
const { encrypt } = require('../helpers/bcrypt')
module.exports = (sequelize, DataTypes) => {

  class User extends sequelize.Sequelize.Model {
    get id() {
      return this.id
    }
    get email() {
      return this.email
    }
    get password() {
      return this.password
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Email is required field'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { 
          args: true,
          msg: 'Password is required field'
        },
        len: {
          args: [8],
          msg: 'Password must be at least 8 characters'
        }
      }
    }
  }, {
    sequelize,
    hooks: {
      beforeCreate: (User, options) => {
        User.password = encrypt(User.password)
      }
    },
    modelName: 'User'
  })
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Product, { foreignKey: 'userId', onDelete: 'CASCADE' })
  };
  return User;
};