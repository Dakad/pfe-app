'use strict';

const nconf = require("nconf");

const Util = require('../modules/util');


const CodesModel = function(sequelize, DataTypes) {
  var Codes = sequelize.define('Codes', {
    user : { // a unique string representing the registred client
      type:DataTypes.INTEGER,
      primaryKey: true,

    },
    client: { // App required
      type:DataTypes.UUID,
      primaryKey: true,

    }
  }, {
    comment: "Contains the app authorized by User to acces their data",
    schema:nconf.get('DATABASE_SCHEMA') || 'public',

    classMethods: {
      associate: function(models) {
        Codes.belongsTo(models.Users, { as: 'consumer',foreignKey:'user' }); // Codes will keep the FK
        Codes.belongsTo(models.Boxes, { as: 'app',foreignKey:'client' }); // Codes will keep the FK
      }
    },

    // Hooks are function that are called before and
    // after (bulk-) creation/updating/deletion and validation.
    hooks: {
        beforeCreate: function (code) {

        },
    }

  });
  return Codes;
};



module.exports = CodesModel;