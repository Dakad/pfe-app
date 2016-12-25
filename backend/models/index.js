'use strict';

/**
 * =============================
 *
 * Data Access Layer - handle the connection to the DB
 *
 * =============================
 *
 * Attributes : DB - Hold the conection to the pool
 *
 * Methods : /

 *
 * Events : /
 *
 *
 * =============================
 */



/**
 * Load modules dependencies.
 */

// Built-in
const fs        = require('fs');
const path      = require('path');
const nconf     = require('nconf');
const Sequelize = require('sequelize');
const basename  = path.basename(module.filename);

// Custom - Mine
const logger    = require('../modules/logger');
const DB        = {
  Sequelize : Sequelize
};
var sequelize;





function initDB (){
    sequelize = new Sequelize(nconf.get('DATABASE_URL'),nconf.get('DB_CONFIG'));

    fs.readdirSync(__dirname)
      .filter(function(file) {
        return ((file.indexOf('.') !== 0) && (file !== basename) && (path.extname(file) === '.js'));
      })
      .forEach(function(file) {
        // Grab all the model files from the current directory,
        var model = sequelize['import'](path.join(__dirname, file));
        // Add them to the db object,
        DB[model.name] = model;
      });

    Object.keys(DB).forEach(function(modelName) {
      // Apply any relations between each model (if any).
      if (modelName.toLowerCase() !== 'sequelize' && DB[modelName].associate) {
        DB[modelName].associate(DB);
      }
    });

    DB.sequelize = sequelize;
}


const connect = function (){
  initDB();
  sequelize.authenticate()
    .then(function() {
      logger.info('[DB] Connection has been established successfully.');
    }).catch(function (err) {
      throw new Error('[DB] Unable to connect to the DB - '+err.message);
    });

};




DB.stopConnection  = function (){
  DB.sequelize.close();
  logger.warn('[DB] All connections to DB closed and released');

};
DB.initConnection = connect;


module.exports = DB;
