'use strict';
module.exports = function(sequelize, DataTypes) {
  var Genres = sequelize.define('Genres', {
    name :{
      type : DataTypes.STRING,
      allowNull : false,
      unique : true
    },
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Genres.belongsToMany(models.Books, {through: 'BookGenres'});
      }
    }
  });
  return Genres;
};