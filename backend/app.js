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
const Config = require('./modules/config.js');
const Server = require('./modules/server.js');
const Logger = require('./modules/logger.js');



Config.load()
  .then(Server.start)
  .catch(function (err) {
    Logger.error(err);
    Server.stop();
  });


// If ctrl+c
process.on('SIGINT', Server.stop);
process.on('SIGTERM', Server.stop);

// If Exception
// using uncaughtException is officially recognized as crude.
// So listening for uncaughtException is just a bad idea.
// process.on('uncaughtException', Server.stop);