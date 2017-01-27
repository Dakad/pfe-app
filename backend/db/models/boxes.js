'use strict';

const nconf = require("nconf");

const Util = require('../../modules/util');


const BoxesModel = function(sequelize, DataTypes) {
  var Boxes = sequelize.define('Boxes', {
    clientId: { // a unique string representing the registred client
      primaryKey: true,
      type: DataTypes.STRING,
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
    },
    clientRedirectUri: {
      type: DataTypes.STRING,
      allowNull: false
    },
    clientUseRedirectUri: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    clientType: { //  based on their ability to auth securely with the authorization server CONFIDENTIAL(TLS),PUBLIC
      type: DataTypes.ENUM('CONFIDENTIAL', 'PUBLIC'),
      allowNull: true,
    },

    clientDescription : DataTypes.TEXT


  }, {
    comment: "Contains the registered client app using the route '/api' ",
    schema: nconf.get('DATABASE_SCHEMA') || 'public',

    classMethods: {
      associate: function(models) {

        Boxes.belongsToMany(models.Users, { as: 'consumers', through: models.Codes, foreignKey: 'consumer' });

        Boxes.belongsTo(models.Users, {
          as: 'apps',
          foreignKey: 'owner'
        }); // Boxes will keep the FK to Users

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
