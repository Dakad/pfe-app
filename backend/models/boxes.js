'use strict';

const nconf = require("nconf");

const Util = require('../modules/util');


const BoxesModel = function(sequelize, DataTypes) {
  var Boxes = sequelize.define('Boxes', {
    clientId : {
      type:DataTypes.STRING,
      allowNull : false
    },
    apiId: {
      type:DataTypes.STRING,
      allowNull : false,
      unique : true,
    },
    apiKey: {
      type:DataTypes.STRING,
      allowNull : false
    },
    appName: {
      type:DataTypes.STRING,
      allowNull : true,
      defaultValue : null
    },
  }, {
    comment: "Contains the API tokens delivered to registered user",
    schema:nconf.get('DATABASE_SCHEMA') || 'public',

    classMethods: {
      associate: function(models) {
        Boxes.belongsTo(models.Users);
      }
    },

    // Hooks are function that are called before and
    // after (bulk-) creation/updating/deletion and validation.
    hooks: {
        beforeCreate: function (box) {
            // First salt to be used as apiId
            return Util.generateSalt().then(function(apiId){
              // A client ID to id wich calling is used
              box.clientId = Util.generateShortUUID();
              box.apiId = apiId;
            }).then(Util.generateSalt)
            .then(function (apiKey){ // Last salt to be used as API Key
                box.apiId = apiKey;
            });
        },
    }

  });
  return Boxes;
};



module.exports = BoxesModel;