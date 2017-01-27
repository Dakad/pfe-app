'use strict';

/**
 * =============================
 *
 * DAO to handle CRUD  on Boxes Model
 * All methods returns a Promise
 *
 * =============================
 *
 * Attributes : /
 *
 * Methods : /
 *		- addBox()
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






const BoxeDAO = {

    create : function (nApp) {
        DB.Boxes.create(nApp,{
            include: [{model : DB.Users,  as: 'apps'}]
        }).catch(errorHandler);
    },

    getUsersApps : function (id) {
        return DB.Boxes.findAll({
            where: { owner: id},
        }).catch(errorHandler);
    },

    findById :  function (id) {
        return DB.Boxes.findById(id).catch(errorHandler);
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

module.exports = BoxeDAO;