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
const oAuthServer = require('express-oauth-server');


// Custom -Mine
const logger = require('../modules/logger');
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
            return Promise.reject(new ApiError(404, 'The user with ' + user.email + ' is not registred'));
        return [dbUser, Util.validPassword(user.pwd, dbUser.get('salt'), dbUser.get('pwd'))];
    }).spread(function(dbUser,isValidPwd) {
        if (!isValidPwd)
            return Promise.reject(new ApiError(401, 'Unknown user'));

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

            user = req.body;
            return user.email;
        }).then(UsersDAO.findByEmail) // Go Fetch a possible registred user with the same email.
        .then(function(dbUser) {
            if (dbUser)
                return Promise.reject(new ApiError(400, dbUser.email + ' is already taken. Choose another one'));
            return UsersDAO.create(user);
        }).then(function(){
            return next();
        })
        .catch(function(err) {
            next(err);
        });
};





/*********************************
 * oAuth call
 *********************************/


const checkApiToken = function(req, res, next) {
    //    console.log(req.headers);
    if (!_.isEmpty('')) {

    }
    // Check if token && token is mine
    // If ok, next(true)
    // Otherwise, throw ForbiddenError('You shall not pass ! Auth yourself first')
    next();
}


const oAuthModel = {

    getAccessToken: function(bearerToken) {
        return pg.query('SELECT access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id FROM oauth_tokens WHERE access_token = $1', [bearerToken])
            .then(function(result) {
                var token = result.rows[0];
                return {
                    accessToken: token.access_token,
                    clientId: token.client_id,
                    expires: token.expires,
                    userId: token.userId
                };
            });
    },


    getClient: function*(clientId, clientSecret) {
        return pg.query('SELECT client_id, client_secret, redirect_uri FROM oauth_clients WHERE client_id = $1 AND client_secret = $2', [clientId, clientSecret])
            .then(function(result) {
                var oAuthClient = result.rows[0];

                if (!oAuthClient) {
                    return;
                }

                return {
                    clientId: oAuthClient.client_id,
                    clientSecret: oAuthClient.client_secret
                };
            });
    },


    getRefreshToken: function*(bearerToken) {
        return pg.query('SELECT access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id FROM oauth_tokens WHERE refresh_token = $1', [bearerToken])
            .then(function(result) {
                return result.rowCount ? result.rows[0] : false;
            });
    },


    getUser: function*(username, password) {
        return pg.query('SELECT id FROM users WHERE username = $1 AND password = $2', [username, password])
            .then(function(result) {
                return result.rowCount ? result.rows[0] : false;
            });
    },


    saveAccessToken: function*(token, client, user) {
        return pg.query('INSERT INTO oauth_tokens(access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id) VALUES ($1, $2, $3, $4)', [
            token.accessToken,
            token.accessTokenExpiresOn,
            client.id,
            token.refreshToken,
            token.refreshTokenExpiresOn,
            user.id
        ]).then(function(result) {
            return result.rowCount ? result.rows[0] : false;
        });
    },


}

// Add OAuth server.
const oAuth = new oAuthServer({
    debug: true,
    model: oAuthModel,
    useErrorHandler: true,
    continueMiddleWare: true,

});





/**
 * Exports
 */

// Variables
module.exports = {

}



// Methods
module.exports = {

    isLogged: isAuth,

    validToken: checkApiToken,

    logMe: logIn,

    registerMe: signUp,

    getOAuth: function(){ return oAuth},
};
