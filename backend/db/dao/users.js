'use strict';

/**
 * =============================
 *
 * DAO to handle CRUD  on User Model
 * All methods returns a Promise
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



 // Custom - Mine
const Util = require('../../modules/util');
const ApiError = require('../../modules/api-error');
const DB = require('../dal');






const UserDAO = {

    create      : function (nUser) {
        return DB.Users.create(nUser).catch(errorHandler);
    },


    findByEmail : function (email){
        return DB.Users.findOne({
            attributes : ["id", "email", "name", "salt", "pwd", "isAdmin", "avatar"],
            where: { email : email}
        }).catch(errorHandler);
    },














};






function errorHandler (err){

    console.log(err);
    debugger;

}






/**
 * Exports
 */

// Object

module.exports = UserDAO;