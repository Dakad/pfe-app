'use strict';
module.exports = function(sequelize, DataTypes) {
  var Authors = sequelize.define('Authors', {
    firstname: {
      types : DataTypes.STRING,
      allowNull : false
    },
    lastname: {
      types : DataTypes.STRING,
      allowNull : false
    },
  }, {
    classMethods: {
      associate: function(models) {
        Authors.belongsToMany(models.Books,{through: 'BookAuthors'});
      }
    }
  });
  return Authors;
};