'use strict';
module.exports = function(sequelize, DataTypes) {
  var Books = sequelize.define('Books', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    resume: DataTypes.TEXT,
    cover: DataTypes.TEXT,
    year: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        Books.belongsTo(models.Users);
        Books.belongsTo(models.Langs);
        Books.belongsToMany(models.Users, {through: 'BookOwners'})
        Books.belongsToMany(models.Users, {through: 'BookFavoured'})
        Books.belongsToMany(models.Genres, {through: 'BookGenres'})
        Books.belongsToMany(models.Authors, {through: 'BookAuthors'})
      }
    }
  });
  return Books;
};