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
 * Methods :
 *		+ initConnection([])
 *		+ stopConnection([callback])
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
const nconf = require('nconf');
const pg    = require('pg');

// Custom - Mine
const logger = require('../modules/logger.js');


/**
 * Variables
 */
var _db;
var _maxClients;



const connect = function (){
    //this initializes a connection pool
    //it will keep idle connections open for a 3 seconds
    //and set a limit of maximum 10 idle clients
    const Pool = new pg.Pool(nconf.get('DB_Config'));
    _maxClients = nconf.get('DB_Config')['max'];

    Pool.on('error', (err, client) => {
      // if an error is encountered by a client while it sits idle in the pool
      // the pool itself will emit an error event with both the error and
      // the client which emitted the original error
      // this is a rare occurrence but can happen if there is a network partition
      // between your application and the database, the database restarts, etc.
      // and so you might want to handle it and at least log it out
      console.error(err);
      logger.error('[DB] Idle client error', err.message, err.stack);
    });

    Pool.on('connect', (client) => {
        logger.info('[DB] DB Postgre Connected to DB:',client.database,'on', client.host);
    });

    // to run a query we can acquire a client from the pool,
    // run a query on the client, and then return the client to the pool
    // to run a query we can acquire a client from the pool,
    // run a query on the client, and then return the client to the pool
    _db = Pool.connect();
};


const stop = function (){


};




/**
 * Exports
 */

// Attributes
module.exports.MAX_CLIENTS = _maxClients;
module.exports.DAL = _db;


// Methods
module.exports = {

    initConnection  : connect,

    stopConnection  : stop,
};