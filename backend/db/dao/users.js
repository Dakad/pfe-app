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
 *		- create (nUser)
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

    create: function(nUser) {
        nUser = DB.Users.build({
            email : nUser.email,
            pwd : nUser.pwd
        });
        return DB.Users.findOrCreate({
            where: {id: nUser.get('email')},
            defaults : nUser.get({plain: true})
        }).spread(function(user,created){
            if (!created)
                throw new ApiError(400, user.email + ' is already taken. Choose another one');
            return created;
        });
    },


    findByEmail: function(email) {
        return DB.Users.findOne({
            attributes: ["id", "email", "name", "salt", "pwd", "isAdmin", "avatar"],
            where: {    email: email}
        }).catch(errorHandler);
    },














};






function errorHandler(err) {

    console.log(err);
    debugger;

}






/**
 * Exports
 */

// Object

module.exports = UserDAO;
