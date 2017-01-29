'use strict';

/**
 * =============================
 *
 * Ctrler for the route demanding some authentication
 * All methods receive (req:Request,res:Response,next:Middleware)
 *
 *
 * =============================
 *
 * Attributes : /
 *
 * Methods : /
 *		+ isAuth()
 *		+ checkToken()
 *		+ logIn()
 *		+ signUp()

 *
 * Events : /
 * =============================
 */


/**
 * Load modules dependencies.
 */
// Built-in
const nconf = require('nconf');
const _ = require("lodash/core");
const unless = require('express-unless');


// Custom -Mine
const renderCtrl = require('./render');
const Util = require('../modules/util');
const ApiError = require('../modules/api-error');
const DB = require('../db/dal');
const UsersDAO = require('../db/dao/users');
const AppsDAO = require('../db/dao/apps');





/*********************************
 * Public call
 *********************************/



/**
 * Check if this public requested made by user is auth before
 *
 */
const isAuth = function(req, res, next) {
    const cookies = req.signedCookies;
    // If not, check if req.headers || req.body contains a token
    // Otherwise, throw ForbiddenError('You shall not pass ! Auth yourself first')
    if (!(cookies.isAuth && cookies.accessToken))
        return next(new ApiError.Unauthorized('You shall not pass ! Log in before to access this page !'));
    Util.validToken(cookies.accessToken)
        .then(function(decodedToken) {
            req.user = decodedToken;
            res.locals.isAuth = true;
            next(null,res.locals.isAuth);
        }).catch(function(err) {
            res.clearCookies('accessToken');
            res.clearCookies('isAuth');
            req.session = null; // Destroy session
            res.locals.isAuth = false;
            console.error(err);
        });

}
isAuth.unless = unless;


/**
 * Handle the login on the public
 *
 */
const logIn = function(req, res, next) {
    const user = req.body;
    // Validate the input from the user
    Util.valideInput(user).then(function() {
        // Sanitize & clear the input
        req.sanitizeBody('email').normalizeEmail();
        // Go fecth the corresponding user in DB
        return UsersDAO.findByEmail(user.email);
    }).then(function(dbUser) {
        if (!dbUser)
            throw new ApiError(404, 'The user with ' + user.email + ' is not registred');
        return [dbUser, Util.validPassword(user.pwd, dbUser.get('salt'), dbUser.get('pwd'))];
    }).spread(function(dbUser,isValidPwd) {
        if (!isValidPwd)
            throw new ApiError(401, 'Unknown user');
        req.user = dbUser.toJSON();
        req.user.salt = req.user.pwd = undefined; // REmove the salt and pwd before return
        // Generate a token {id,expTime} signed with env['TOKEN_SECRET']
        return Util.generateToken({
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            isAdmin: req.user.isAdmin
        }, nconf.get('TOKEN_SECRET'));
    }).then(function(token) { // Call the next middleware
        req.user.token = token;
        next(null,true);
    }).catch(function(err) {
        if (!err instanceof ApiError)
            err = new ApiError(err);
        next(err);
    });
};


/**
 * Handle the signup on the public
 *
 */
const signUp = function(req, res, next) {
    let user;

    // Validate the input from the req.body
    Util.valideInput(req.body)
        .then(function() {
            // Sanitize & clear the input
            req.sanitizeBody();
            req.sanitizeBody('email').normalizeEmail();

            return req.body;
        }).then(UsersDAO.create) // Go Fetch a possible registred user with the same email.
        .then(function(created) {
            return next();
        }).catch(function(err) {
            next(err);
        });
};





/*********************************
 * Auth call from outside
 *********************************/

const checkApiToken = function(req, res, next) {
    // Check if token && token is mine
    // If ok, next(true)
    // Otherwise, throw ForbiddenError('You shall not pass ! Auth yourself first')
    next();
}

/**
 * Show the page to allow the user to grant a client.
 */
const dialogPage = function (req,res) {
    res.locals.query =  '?'+Object.keys(req.query).reduce((p,q,i) => {
        return (q +'='+ req.query[q] + ((p) ? '&'+p :''));
    },'');
    return renderCtrl.dialogPage(req,res);
}

/**
 * The user allowed the client to gain acces to his data.
 */
const grantApp = function (req,res,next) {
    console.log(req.body);
    if(req.body.choice === 'yes')
        next();

};


/**
 * Error Handler
 */
const errorHandler = function(err, req, res, next) {
    if(req.path === '/grant')
        return dialogPage(req,res);



    debugger;
};







/**
 * Exports
 */

// Variables
module.exports = {

}


// Methods
module.exports = {
    errorHandler : errorHandler,

    isLogged: isAuth,

    authorize : checkApiToken,

    logMe: logIn,

    registerMe: signUp,

    dialogPage : dialogPage,

    //afterLoggedForGrant : afterLogged,

    grant   : grantApp,



};
