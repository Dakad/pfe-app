'use strict';
module.exports = function(sequelize, DataTypes) {
  var Authors = sequelize.define('Authors', {
    firstname: {
      type : DataTypes.STRING,
      allowNull : false
    },
    lastname: {
      type : DataTypes.STRING,
      allowNull : false
    },
  }, {
    classMethods: {
      associate: function(models) {
          Authors.belongsToMany(models.Books, {through: 'Publications'});
      }
    }
  });
  return Authors;
};