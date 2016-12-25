'use strict';

const nconf = require("nconf");

module.exports = function(sequelize, DataTypes) {
  var Boxes = sequelize.define('Boxes', {
    apiID: {
      type:DataTypes.TEXT,
      allowNull : false,
      unique : true,
    },
    apiKey: {
      type:DataTypes.TEXT,
      allowNull : false
    }
  }, {
    comment: "Contains the API tokens delivered to registered user",
    schema:nconf.get('DATABASE_SCHEMA') || 'public',

    classMethods: {
      associate: function(models) {
        Boxes.belongsTo(models.Users);
      }
    }
  });
  return Boxes;
};