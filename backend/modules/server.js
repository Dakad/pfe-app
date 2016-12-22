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
const Promise    = require('promise');
const nconf      = require('nconf');
const express    = require('express');
const path       = require('path');
const Morgan     = require('morgan');
const bodyParser = require('body-parser');


// Custom - Mine
const DB        = require("../models/db.js")
const logger    = require("./logger.js");

// Routes
const defRoute = require('../routes/public');
const apiRoute = require('../routes/api');


/**
 * Variables
 */

// Server
const _app = express();
// To expose the methods on the server for outside
const Server = {};



/**
 * Configure server settings:
 *		- Set view engine json bodies
 *		- parse json bodies
 *
 * Configure server route and error middlewares:
 *		- Set all possibles routes
 *		- Set the error middlewares
 */
function configServer(){
  return Promise.resolve(() =>{
    logger.info('[Server] Init the DB with the pool : MAX. Client ',DB.MAX_CLIENTS);
    DB.initConnection();
  }).then(function() {
    // View engine setup
    var folder =  path.join(__dirname,'..' , 'views');
    logger.info('[Server] Init the app(Express) with views folder : ',folder);
    _app.set('views', folder);
    logger.info('[Server] Init the app(Express) with Views Engine :',' Pug(Jade)');
    _app.set('view engine', 'pug');

    // Get port from env and store in Express.
    logger.info('[Server] Init the app(Express) with env Port : ',nconf.get('PORT'));
    _app.set('port', nconf.get('PORT'));

    logger.info('[Server] Init the app(Express) with Logger :', 'WINSTON with morgan stream');
    _app.use(Morgan("dev"));

    logger.info('[Server] Init the app(Express) with BOdyParson to :','JSON');
    _app.use(bodyParser.json()); // The body is parsed into JSON
    _app.use(bodyParser.urlencoded({ extended: false })); // The JSON parsed body will only
    // contain key-value pairs, where the value can be a string or array

    folder =  path.join(__dirname,'..' , 'public');
    logger.info('[Server] Init the app(Express) with static folder : ',folder);
    _app.use(express.static(path.join(__dirname, '../public')));

  }).then(function (){

    logger.info('[Server - Route] Init the app(Express) with route for : ', '/public/*');
    _app.use('/public', defRoute);
    logger.info('[Server - Route] Init the app(Express) with route for : ', '/api/*');
    _app.use('/api', apiRoute);

    // catch 404 and forward to error handler
    _app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    _app.use(function(err, req, res) {
      // set locals, only providing error in development
      res.locals.msg = err.message;
      res.locals.error = req._app.get('env') === 'development' ? err : {};
      logger.err(err);
      // render the error page
      res.status(err.status || 500).render('error');
    });

    logger.info('[Server] Init done !');
  })
};





/**
 * Start the server:
 *		- Config server
 *		- Config Routes
 *		- Attach all necessary listener
 *		- Notify the callback
 *
 */
Server.start = function (cb){
  return configServer()
      .then(function () {
        // Hold the instance of server
        Server._server = _app.listen(nconf.get('PORT'));

        Server._server.on('listening', function (){
          var addr = Server._server.address();
          var bind = typeof addr === 'string'
              ? 'pipe ' + addr
              : 'Port ' + addr.port;
          logger.info('[Server] Web server listening on', bind);
        });

        Server._server.on('close', Server.stop);
        Server._server.on('error', function (error) {
          if (error.syscall !== 'listen') {
            throw error;
          }

          var bind = nconf.get('PORT');

          // handle specific listen errors with friendly messages
          switch (error.code) {
            case 'EACCES':
              Server.onError(new Error(bind + ' requires elevated privileges',error));
              break;
            case 'EADDRINUSE':
              Server.onError(new Error(bind + ' is already in use',error));
              break;
            default:
              Server.onError(error);
          }
        });

    }).nodeify(cb);
}


/**
 * Stop the server:
 *		- Close the pool and the connection to PG
 *    - Stop the server
 *
 *
 */
Server.stop = function (){
  const _server = Server._server;
  if (_server && typeof _server.close == 'function') {
		DB.stop();
		_server.close();
		logger.warn('[Server] Web server no more listening on ' +_server.address().port);
	} else {
		logger.warn('[Server] Cannot stop web server not yet init. listening on ' +_server.address().port);
	}
};


/**
 * Events cb for error the Server
 */
Server.onError = function (err) {
		logger.warn('[Server] ' +err);
};


/**
 * Exports
 */

// Methods

module.exports = Server;