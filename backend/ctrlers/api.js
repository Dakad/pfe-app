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






const sendJsonResponse = function (res,statut, data){
    res.status(statut).json(data);
};





/**
 * Exports
 */

// Methods
module.exports = {
    


};