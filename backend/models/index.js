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
const fs = require('fs');
const path = require('path');
const nconf = require('nconf');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);

// Custom - Mine
const logger = require('../modules/logger');
const DB = {
    Sequelize: Sequelize
};





function initSequelize() {
    DB.sequelize = new Sequelize(nconf.get('DATABASE_URL'), nconf.get('DB_CONFIG'));

    fs.readdirSync(__dirname)
        .filter(function(file) {
            // Check : not hidden files || index && .js file
            return ((file.indexOf('.') !== 0) && (file !== basename) && (path.extname(file) === '.js'));
        })
        .forEach(function(file) {
            // Grab all the model files from the current directory,
            var model = DB.sequelize['import'](path.join(__dirname, file));
            // Add them to the db object,
            DB[model.name] = model;
        });

    Object.keys(DB).forEach(function(modelName) {
        // Apply any relations between each model (if any).
        if (modelName.toLowerCase() !== 'sequelize' && DB[modelName].associate) {
            DB[modelName].associate(DB);
        }
    });

}


const connect = function() {
    initSequelize();
    const nbPool = nconf.get('DB_CONFIG').pool.min + ' - ' + nconf.get('DB_CONFIG').pool.max;
    logger.info('[DB] Init the DB with the pool : Client  Min - MAX. ', nbPool);
    return DB.sequelize.authenticate()
        .then(DB.sync) // Create all tables if they doesn't exist in database
        .then(function() {
            const urlDB = nconf.get('DATABASE_USER') +'@'+nconf.get('DATABASE_SERVER')+  '~'+nconf.get('DATABASE_NAME');
            logger.info('[DB] Connection has been established successfully to :',urlDB);
        }).catch(function(err) {
            throw new Error('[DB] Unable to connect to the DB - ' + err.message);
        });

};




DB.stopConnection = function() {
    DB.sequelize.close();
    logger.warn('[DB] All connections to DB closed and released');

};
DB.initConnection = connect;


module.exports = DB;