'use strict';

const nconf = require("nconf");


const Util = require('../modules/util');


const UserModel = function(sequelize, DataTypes) {
  const Users = sequelize.define('Users', {
    clientId: {
      type:DataTypes.STRING,
      unique : true
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
        Users.hasOne(models.Boxes,{
          onDelete: "CASCADE"
        })
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