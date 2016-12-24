'use strict';
module.exports = function(sequelize, DataTypes) {
  var Genres = sequelize.define('Genres', {
    name :{
      types : DataTypes.STRING,
      allowNull : false,
      unique : true
    },
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Genres.belongsTo(models.Books);
      }
    }
  });
  return Genres;
};