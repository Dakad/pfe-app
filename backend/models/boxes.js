'use strict';

const nconf = require("nconf");

const Util = require('../modules/util');


const BoxesModel = function(sequelize, DataTypes) {
  var Boxes = sequelize.define('Boxes', {
    clientId: { // a unique string representing the registred client
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: function() {
        return Util.generateShortUUID();
      },
    },
    clientName: { // App name required
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    clientSecret: { //
      type: DataTypes.STRING,
      allowNull: false
    },
    clientRedirectUri: {
      type: DataTypes.STRING,
      allowNull: false
    },
    clientType: { //  based on their ability to auth securely with the authorization server CONFIDENTIAL(TLS),PUBLIC
      type: DataTypes.ENUM('CONFIDENTIAL', 'PUBLIC'),
      allowNull: false,
    }
  }, {
    comment: "Contains the registered client app using the route '/api' ",
    schema: nconf.get('DATABASE_SCHEMA') || 'public',

    classMethods: {
      associate: function(models) {
        Boxes.belongsTo(models.Users, {
          as: 'owner'
        }); // Boxes will keep the FK to Users
        Boxes.hasMany(models.Codes, {
          as: 'client'
        }); // Codes will keep the FK to Codes
      }
    },

    // Hooks are function that are called before and
    // after (bulk-) creation/updating/deletion and validation.
    hooks: {
      beforeCreate: function(box) {
        // First salt to be used as apiId
        return Util.generateSalt().then(function(salt) {
          box.clientSecret = salt;
          // }).then(Util.generateSalt)
          // .then(function (clientSecret){ // Last salt to be used as clientSecret
          //     box.clientSecret = clientSecret;
        });
      },
    }

  });
  return Boxes;
};



module.exports = BoxesModel;
