'use strict';
module.exports = function(sequelize, DataTypes) {
  var Langs = sequelize.define('Langs', {
    code: {
      types     : DataTypes.STRING,
      allowNull : false,
      unique    : true
    },
    name: {
      types    : DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Langs.belongsTo(models.Books);
      }
    }
  });
  return Langs;
};