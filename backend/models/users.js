'use strict';

const nconf = require("nconf");

module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    email: {
      type:DataTypes.STRING,
      allowNull : false,
      unique : true,
      validate: {notNull:true, notEmpty:true,isEmail : true}
    },
    name : DataTypes.STRING,
    salt: DataTypes.STRING,
    email: {
      type:DataTypes.TEXT,
      allowNull : false,
      validate: {notNull:true, notEmpty:true}
    },
    isAdmin:{
      type :DataTypes.BOOLEAN,
      defaultValue : false
    },
    avatar: DataTypes.TEXT
  }, {
    comment: "Contains all users registred into the app.",

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

    schema:nconf.get('DATABASE_SCHEMA') || 'public',

    classMethods: {
      associate: function(models) {
        Users.hasOne(models.Boxes)
      }
    }
  });
  return Users;
};