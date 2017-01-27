'use strict';

const nconf = require("nconf");

const Util = require('../../modules/util');


const CodesModel = function(sequelize, DataTypes) {
  var Codes = sequelize.define('Codes', {
    // client: { // App required
    //   type:DataTypes.UUID,
    //   primaryKey: true,

    // }
  }, {
    comment: "Contains the app authorized by User to acces their data",
    schema:nconf.get('DATABASE_SCHEMA') || 'public',

    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,

    classMethods: {
      associate: function(models) {

        // Codes.Consumers = Codes.belongsToMany(models.Users,{
        //     foreignKey: 'consumer', // Will create a FK in Coxes named 'app'.
        //     through: models.Codes,
        //     as: 'consumers', // The FK in Codes will be aliased/accessible as 'authApps'.
        // });

        // // To keep all apps allowed by the user to get data
        // Codes.AuthApps = Codes.belongsToMany(models.Boxes, {
        //     foreignKey: 'app', // Will create a FK in Coxes named 'app'.
        //     through: models.Codes,
        //     as: 'authApps', // The FK in Codes will be aliased/accessible as 'authApps'.
        // });

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