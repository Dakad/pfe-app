'use strict';

/**
 * =============================
 *
 * Config - Load the config variable from .env
 *
 * =============================
 *
 * Attributes : /
 *
 * Methods :
 *		- dbUrlParseur()
 *		+ load()
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
const Promise   = require("promise");
const dconf     = require('dotenv');
const nconf     = require('nconf');
const URL       = require('url');
const uuidV4    = require('uuid/v4');

// Custom - Mine
const logger    = require("./logger.js")




const dbUrlParseur = function (cb){
    const DB_URL = URL.parse(process.env.DATABASE_URL);
    const DB_AUTH = DB_URL.auth.split(':');

    nconf.overrides({
        'DB_Config':{
            user: DB_AUTH[0], //env var: DATABASE_USER
            password: DB_AUTH[1],   //env var: DATABASE_PASSWORD
            host: DB_URL.hostname, // Server hosting the postgres database
            port: DB_URL.port, //env var: DATABASE_PORT
            database: DB_URL.pathname.split('/')[1],
            max: 17, //set pool max size to 30
            min: 5, //set min pool size to 5
            idleTimeoutMillis: 3000 //close idle clients after 3 seconds
        }
    });
}


/**
 * Exports
 */

// Methods
module.exports = {
    load : function(){
        return new Promise(function (fulfill, reject){
            try{
                logger.info('[Config] Load .env vars into process.env');
                dconf.load(); // LOAD my .env files into process.env
                nconf.env(); // LOAD All process into nconf
                dbUrlParseur();
                // If not env. var TOKENT_SECRET, define a new one.
                nconf.defaults({'TOKEN_SECRET' : uuidV4() });
                return fulfill();   // Done, next task on the promise
            }catch(ex) {
                return reject(new Error('[DB] Error while loading all configs - '+ex.message))
            }
        });
    }



};



