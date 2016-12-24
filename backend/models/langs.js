'use strict';
module.exports = function(sequelize, DataTypes) {
  var Langs = sequelize.define('Langs', {
    code: {
      type     : DataTypes.STRING,
      allowNull : false,
      unique    : true
    },
    name: {
      type    : DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Langs.belongsToMany(models.Books, {through: 'Editions'});
      }
    }
  });
  return Langs;
};