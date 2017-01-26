'use strict';
/**
 * =============================
 *
 * Server , start/stop the server...
 *
 * =============================
 *
 * Attributes : /
 *
 * Methods :
 *		- configServer():  Promise
 *		+ start()
 *		+ stop()
 *
 * Events :
 *    - onError([callback])
 *
 * =============================
 */


/**
 * Load modules dependencies.
 */

// Built-in
const Promise = require('promise');
const nconf = require('nconf');
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const Morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');


// Custom - Mine
const DB = require("../models/index");
const logger = require("./logger");


// Routes
const apiRoute = require('../routes/api');
const oauthRoute = require('../routes/oauth');
const defRoute = require('../routes/public');



/**
 * Variables
 */

// Server
const _app = express();
// To expose the methods on the server for outside
const Server = {};



/**
 * Return the port listened on the server.
 * If the server not defined yet, return the default port on env var.
 *
 */
function getBindedServerPort() {
    return (Server._server && Server._server.address()) ? Server._server.address().port : nconf.get('PORT');
}


/**
 * Configure server settings:
 *		- Set view engine json bodies
 *		- parse json bodies
 *
 */
function configServer() {
    return new Promise(function(fulfill) {
            let folder = path.join(__dirname, '..', 'public');
            logger.info('[Server] Init the app(Express) with static folder :', folder);
            _app.use(express.static(folder));

            folder = path.join(folder, 'img', 'favicon.ico');
            logger.info('[Server] Init the app(Express) with the favicon :', folder);
            _app.use(favicon(folder));

            // View engine setup
            folder = path.join(__dirname, '..', 'views');
            logger.info('[Server] Init the app(Express) with views folder :', folder);
            _app.set('views', folder);


            logger.info('[Server] Init the app(Express) with Views Engine :', ' Pug(Jade)');
            _app.set('view engine', 'pug');

            // Get port from env and store in Express.
            // logger.info('[Server] Init the app(Express) with env Port :',nconf.get('PORT'));
            // _app.set('port', nconf.get('PORT'));

            logger.info('[Server] Init the app(Express) with Logger :', 'WINSTON with morgan stream');
            _app.use(Morgan("short"));


            logger.info('[Server] Init the app(Express) with BOdyParser to :', 'JSON');
            _app.use(bodyParser.json()); // The body is parsed into JSON
            _app.use(bodyParser.urlencoded({
                extended: false
            })); // The JSON parsed body will only
            // contain key-value pairs, where the value can be a string or array


            logger.info('[Server] Init the app(Express) with validator middleware :', 'expressValidator');
            _app.use(expressValidator());


            logger.info('[Server] Init the app(Express) protection from some well-known web vulnerabilities :', 'helmet');
            //_app.use(helmet());
            // _app.use(helmet.noCache());


            logger.info('[Server] Init done !');
            fulfill();
        });
};





/**
 *
 * Configure server route and error middlewares:
 *		- Set all possibles routes
 *		- Set the config middlewares to the route
 *		- Init the route
 */
function configRoutes() {
    return new Promise(function(fulfill) {
        logger.info('[Server - Routes] Init the app(Express) with route for : ', '/*', '/public/*');
        logger.info('[Server - Routes] Init route / with CookieParser ');
        _app.use('/', cookieParser(nconf.get('COOKIE_SECRET')));
        _app.use('/', defRoute);
        _app.use('/public', defRoute);
        defRoute.init();

        logger.info('[Server - Routes] Init the app(Express) with route for : ', '/oauth/*');
        _app.use('/oauth', oauthRoute);
        oauthRoute.init();

        logger.info('[Server - Routes] Init the app(Express) with route for : ', '/api/*');
        _app.use('/api', apiRoute);
        apiRoute.init();


        logger.info('[Server - Routes] Init done !');
        fulfill();
    });

}











/**
 * Start the server:
 *		- Config server
 *		- Config Routes
 *		- Attach all necessary listener
 *		- Notify the callback
 *
 */
Server.start = function(cb) {

    return Promise.all([DB.initConnection(), configServer(), configRoutes()])
        .then(function () {
            // Hold the instance of server
            Server._server = _app.listen(nconf.get('PORT'));

            Server._server.on('listening', function() {
                logger.info('[Server] Web server listening on Port', getBindedServerPort());
            });

            Server._server.on('close', Server.stop);
            Server._server.on('error', function(error) {
                if (error.syscall !== 'listen') {
                    throw error;
                }

                // handle specific listen errors with friendly messages
                switch (error.code) {
                    case 'EACCES':
                        Server.onError(new Error('Port :' + getBindedServerPort() + ' requires elevated privileges', error));
                        break;
                    case 'EADDRINUSE':
                        Server.onError(new Error('Port :' + getBindedServerPort() + ' is already in use', error));
                        break;
                    default:
                        Server.onError(error);
                }
            });
        }).nodeify(cb); // Change this sh*t function into good Promise
};


/**
 * Stop the server:
 *		- Close the pool and the connection to PG
 *      - Stop the server
 */
Server.stop = function() {
    const _server = Server._server;
    if (_server && typeof _server.close == 'function') {
        DB.stopConnection();
        _server.close();
        logger.warn('[Server] Web server no more listening on Port', getBindedServerPort());
        process.exit();
    }
    else {
        logger.error('[Server] Cannot stop web server not yet still listening on :' + getBindedServerPort());
    }
};


/**
 * Events cb for error the Server
 */
Server.onError = function(err) {
    logger.error('[Server] ' + err);
};




/**
 * Exports
 */

// Methods

module.exports = Server;
