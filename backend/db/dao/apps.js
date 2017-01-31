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
    build   : function (nApp){
        return DB.Apps.build(nApp);
    },

    delete : function (id){
        return DB.Apps.destroy({where : {id : id}});
    },

    update : function (nApp) {
        DB.Apps.findOrCreate(nApp,{
            // fields : ['appName', 'clientRedirectUri','useRedirectUri', 'description'],
            include: [{model : DB.Users,  as: 'apps'}]
        }).catch(errorHandler);
    },

    create : function (nClient) {
        let cond;
        cond = (nClient.id) ? {id: nClient.id} : {name: nClient.name};
        //const nClient = DB.build();
        return DB.Apps.findOrCreate({
            where: cond,
            defaults: nClient.get({plain: true})
        }).catch(errorHandler);
    },

    getUsersApps : function (id) {
        return DB.Apps.findAll({
            where: { owner: id},
        }).catch(errorHandler);
    },

    findById :  function (id) {
        return DB.Apps.findById(id).then(function(app){
            if(!app)
                throw new ApiError.NotFound('This client is not registred.');
            return app;
        });
    },


    checkIfRegistred : function (client) {
        return DB.Apps.findOne({
            attributes :{exclude : ['logo','description','type']},
            where : {
                id : client.id || client.clientId,
                secret : client.secret || client.clientSecret
            }
        }).then(function(dbClient){
            return (dbClient) ? dbClient : new ApiError.NotFound('This client is not registred. Unknown id or secret!');
        });
    }








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