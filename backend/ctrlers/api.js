'use strict';

/**
 * =============================
 *
 * Ctrler for the route /api/*
 * All methods receive (req:Request,res:Response,next:Middleware)
 * Only respond with a statut and JSON Object
 *
 * =============================
 *
 * Attributes : /
 *
 * Methods : /
 *		- sendJsonResponse(req:Req)
 *
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



 // Custom -Mine
const Util = require('../modules/util');
const ApiError = require('../modules/api-error');
const DB = require('../db/dal');
const UserDAO = require('../db/dao/users');
const BoxesDAO = require('../db/dao/boxes');






const sendJsonResponse = function (res,statut,data){
    res.status(statut).json(data);
};




const zen = function(req,res,next){
    return sendJsonResponse(res,200, 'Hello, I\' will soon give u some deep shit quotes ! Just wait for it !');
}






/**
 * Exports
 */

// Methods
module.exports = {
    zen : zen
};