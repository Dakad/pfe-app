'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    email: {
      type:DataTypes.STRING,
      allowNull : false,
      unique : true,
      validate: { isEmail : true}
    },
    name : DataTypes.STRING,
    salt: DataTypes.STRING,
    pwd: DataTypes.STRING,
    date_inscript: DataTypes.DATE,
    role:{
      type :DataTypes.ENUM,
      values : ['USER','ADMIN'],
      defaultValue : 'User'
    },
    avatar: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Users.belongsToMany(models.Books, {through : 'BookFavoured'});
      }
    }
  });
  return Users;
};