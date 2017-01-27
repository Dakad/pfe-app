'use strict';

/**
 * =============================
 *
 * DAO to handle CRUD  on Apps Model
 * All methods returns a Promise
 *
 * =============================
 *
 * Attributes : /
 *
 * Methods : /
 *		- addApps()
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






const AppsDAO = {

    create : function (nApp) {
        DB.Apps.create(nApp,{
            // fields : ['appName', 'clientRedirectUri','useRedirectUri', 'description'],
            include: [{model : DB.Users,  as: 'apps'}]
        }).catch(errorHandler);
    },

    getUsersApps : function (id) {
        return DB.Apps.findAll({
            where: { owner: id},
        }).catch(errorHandler);
    },

    findById :  function (id) {
        return DB.Apps.findById(id).catch(errorHandler);
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

module.exports = AppsDAO;