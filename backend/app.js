'use strict';

/**
 * =============================
 *
 * Main application.
 *
 * =============================
 *
 * Attributes : /
 *
 * Methods : /
 *
 * Events : /
 *
 * =============================
 */


/**
 * Load modules dependencies.
 */

// Custom
var Config = require('./modules/config.js');
var Server = require('./modules/server.js');
var Logger = require('./modules/logger.js');



Config.load()
  .then(Server.start)
  .catch(function (err) {
    Logger.error(err);
    Server.close();
  });


// If ctrl+c
process.on('SIGINT', Server.close);
process.on('SIGTERM', Server.close);
// If Exception
process.on('uncaughtException', Server.close);