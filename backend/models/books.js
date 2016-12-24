'use strict';
module.exports = function(sequelize, DataTypes) {
  var Books = sequelize.define('Books', {
    isbn: {
      type : DataTypes.STRING,
      unique : true,
      allowNull : false
    },
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    resume: DataTypes.TEXT,
    cover: DataTypes.TEXT,
    year: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        Books.belongsToMany(models.Langs, {through: 'Editions'});
        Books.belongsToMany(models.Genres, {through: 'BookGenres'});
        Books.belongsToMany(models.Authors, {through: 'Publications'});
        Books.belongsTo(models.Users,{as:'owner'});
        Books.belongsTo(models.Langs,{as:'lang'});
        Books.belongsToMany(models.Users, {through: 'BookFavoured'});
      }
    }
  });
  return Books;
};