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
            res.clearCookie('accessToken');
            res.clearCookie('isAuth');
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
    Util.validInput(user).then(function() {
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
        });
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
    // Validate the input from the req.body
    Util.validInput(req.body).then(function() {
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


/**
 * Middleware to dig into the request headers or body
 * when the method is POST and url /token
 * to retrieve the infos sent by the client.
 *
 */
const retrieveClientInfo = function (req,res,next)  {
    const retrieveFrom = (source) => {
        const infos = {};
        let info = source['clientId'];

        // Check if at least, the clientId && clientSecret are inside

        if(!info)
            return new ApiError.BadRequest('Missing the clientId for the authentication');
        infos['clientId'] = info.trim();

        if(!(info = source['clientSecret']))
            return new ApiError.BadRequest('Missing the clientSecret for the authentication');
        infos['clientSecret'] = info.trim();

        if(info = source['state']) infos['state'] = info.trim();

        if(info = source['redirectUri']) infos['redirectUri'] = info.trim();

        return infos;
    }

    res.locals.query =  '?'+Object.keys(req.query).reduce((p,q,i) => {
        return (q +'='+ req.query[q] + ((p) ? '&'+p :''));
    },'');

    if(req.method === 'POST') // If the client want something, set in the headers OR body ,not both
        req.from = (req.get('clientId')) ? retrieveFrom(req.headers) : retrieveFrom(req.body);

    if(req.from.type && req.from.type === 'ApiError')
        next(req.from);
    else
        next();
}


/**
 * Middleware to give an accessToken to a client.
 * Dig into the request headers or body and look for an
 *  -   (REQUIRED) client_id || clientId
 *  -   (REQUIRED) client_secret || clientSecret
 *  -   (Optionnal) state
 *  -   (Optionnal) redirect_uri
 * If present && auth, pass and check the lifetime of the token
 * Otherwise, don't talk to him, just shO0ot him with a APIError
 *
 */
const getApiToken = function (req,res) {
    console.log(req.from);

    // Go fetch the requested & registred client
    AppsDAO.checkIfRegistred(req.from)
    .then((client) =>{
        return [
            client,
            Util.validPassword(
                client.id, // The client Id
                req.from.clientSecret, // Equivalent to pwd
                client.accessToken, // The real hash in DB of those two {id+secret}
                client.id.length)
        ];
    }).spread((client,isValid) => {
        if(!isValid)
            throw new ApiError.Unauthorized('This client is not registred. Unknown id or secret!');
        client.accessToken = client.secret = undefined;
        client = client.toJSON();
        client.state = req.from.state;
        if (client.useRedirectUri === false && req.from.redirectUri)
            client.redirectUri = req.from.redirectUri;
        res.client = client;
        return Util.generateToken({
            id: client.id,
            name: client.name,
            scope : client.scope
        });
    }).then((token) => {
        let url = res.client.redirectUri+token;
        url += '&clientId='+res.client.id;
        url += (res.client.state) ? '&state='+res.client.state : '';
        res.redirect(url); // Send back the token
    }).catch((err) => {
        // @TODO REplace by a fct which do that
        res.status(err.status || 500).json(err.message || 'Some error occured, better formatin coming  !');

        debugger;
    });
}


/**
 * Middleware to check if the request is auth.
 * Dig into the request headers or body and look for an
 *  -   (REQUIRED) accessToken || access_token
 * If present && genuine , pass and check the lifetime of the token
 * Otherwise, don't talk to him, just shO0ot him with a APIError
 *
 */
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

    if(req.method === 'GET' && req.path === '/grant'){
        res.client.accessToken = undefined;
        return renderCtrl.dialogPage(req,res);
    }

    return res.redirect('/auth/grant'+res.locals.query);
}


const afterLoggedForGrant = function(req,res){
    //res.redirect('/auth/grant');
}

/**
 * The user allowed the client to gain acces to his data.
 */
const grantApp = function (req,res,next) {
    console.log(req.body);
    debugger
    if(req.body.choice === 'yes')
        DB.App

};


/**
 * Error Handler
 */
const errorHandler = function(err, req, res, next) {
        // An error occured while
       if(req.method === 'GET' && req.path === '/grant' && err.status === 401 ) // An error occured while gather info about the client for display
        return dialogPage(req,res);

    // Create method to send only json for the errors
    // Send th err as json {status,err{status,message}
    res.status(err.status || 500).send(err.message || 'Some error occured, better formatin coming  !');
    //renderCtrl.errorPage(err,req,res);
};







/**
 * Exports
 */


// Export for /public auth
module.exports = {
    errorHandler : errorHandler,

    isLogged: isAuth,

    authorize : checkApiToken,

    logMe: logIn,

    registerMe: signUp,

// Export for /auth for api

    dialogPage : dialogPage,

    afterLoggedForGrant : afterLoggedForGrant,

    grant   : grantApp,

    retrieveClientInfo : retrieveClientInfo,


    getApiToken   : getApiToken



}
