'use strict';

const nconf = require("nconf");


const Util = require('../../modules/util');


const UserModel = function(sequelize, DataTypes) {
  const Users = sequelize.define('Users', {
    id: {
      type:DataTypes.STRING,
      primaryKey : true,
      defaultValue: function() {
            return Util.generateShortUUID();
        },
    },
    email: {
      type:DataTypes.STRING,
      allowNull : false,
      unique : true
    },
    name : DataTypes.STRING,
    salt: DataTypes.STRING,
    pwd: {
      type:DataTypes.STRING,
      allowNull : false
    },
    isAdmin:{
      type :DataTypes.BOOLEAN,
      defaultValue : false
    },
    avatar: DataTypes.TEXT
  }, {
    comment: "Contains all users registred into the app.",
    schema:nconf.get('DATABASE_SCHEMA') || 'public',

    // Add the timestamp attributes (updatedAt, createdAt, deletedAt) to database entries
    timestamps: true,

    // don't delete database entries but set the newly added attribute deletedAt
    // to the current date (when deletion was done).
    // paranoid will only work if timestamps are enabled
    paranoid: true,

    // Enable optimistic locking.  When enabled, sequelize will add a version count attriubte
    // to the model and throw an OptimisticLockingError error when stale instances are saved.
    // Set to true or a string with the attribute name you want to use to enable.
    version: true,

    classMethods: {
      associate: function(models) {
        // To keep all apps registred data through the API
        Users.hasMany(models.Boxes,{
            foreignKey: 'owner', // Will create a FK in Boxes named 'owner'
            onDelete: "CASCADE", // If the box is deleted, don't keep any record of it. JUST DELETE
            as: 'apps', // The FK in Boxes will be aliased as 'owner'.
        }),

        // To keep all apps allowed by the user to get data
        Users.belongsToMany(models.Boxes, {
            foreignKey: 'app', // Will create a FK in Codes named 'app'.
            through: models.Codes,
            as: 'authApps', // The FK in Codes will be aliased/accessible as 'authApps'.
        });

      }
    } ,

    // Hooks are function that are called before and
    // after (bulk-) creation/updating/deletion and validation.
    hooks: {
        beforeCreate: function (user) {
            return Util.generateSalt().then(function(salt){
                user.clientId = Util.generateShortUUID();
                return user.salt = salt;
            }).then(function (salt){
                return Util.hashPassword(user.pwd,salt);
            }).then(function (hashedPwd) {
                user.pwd = hashedPwd;
            });
        },
    }



  });

    return Users;
};



module.exports = UserModel;