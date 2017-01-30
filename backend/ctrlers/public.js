'use strict';

/**
 * =============================
 *
 * Ctrler for the route /public/*
 * All methods receive (req:Request,res:Response,next:Middleware)
 * Only respond with a page to render and some variables
 *
 * =============================
 *
 * Attributes : /
 *
 * Methods : /
 *		+ renderHomePage()
 *		+ renderLoginPage()
 *		+ renderSignupPage()
 *		+ renderAboutPage()
 *		+ renderDocPage()
 *		+ renderExePage()
 *		+ renderDashboardPage()
 *		+ renderErrorPage()
 *		+ errorHandler()
 *
 * Events : /
 * =============================
 */


/**
 * Load modules dependencies.
 */
// Built-in
const _ = require("lodash/core");
const unless = require('express-unless');


// Custom - Mine
const renderCtrl = require('./render');
const logger = require('../modules/logger');
const Util = require('../modules/util');
const ApiError = require('../modules/api-error');
const DB = require('../db/dal');
const UsersDAO = require('../db/dao/users');
const AppsDAO = require('../db/dao/apps');



/**
 * Variables
 *
 */


const DEFAULT_COOKIE_OPTIONS = {
    httpOnly: true,
    signed: true,
};


const validSchema = {
    customValidators: {
        isAppNameValid: function(value) {
            // TODO check the app name regex [a-zA-Z0-9-_#!&]{2,50}
            return true;
        }
    },
    'appName': {
        errorMessage: 'Invalid Application name',
        notEmpty: true,
        isLength: {
            options: [{
                min: 2,
                max: 50
            }],
            errorMessage: 'The name must be between 2 and 50 chars long' // Error message for the validator, takes precedent over parameter message
        },
    },
    'appUri': {
        errorMessage: 'This URI is invalid',
        notEmpty: true,
        matches: {
            options: ['example', 'i'] // pass options to the validator with the options property as an array
                // options: [/example/i] // matches also accepts the full expression in the first parameter
        },
    },
    'appDescrip': {
        optional: true, // won't validate if field is empty
        isLength: {
            options: [{
                max: 150
            }],
            errorMessage: 'This description is too long. Cut some, please !'
        },
    },

    'email': {
        errorMessage: 'This email is invalid',
        notEmpty: {
            errorMessage: 'Missing the email to be logged in'
        },
        isEmail: {
            errorMessage: 'Put a valid email to continue'
        }
    },

    'pwd': {
        errorMessage: 'This password is invalid',
        notEmpty: {
            errorMessage: 'Missing the pwd to be logged in'
        }
        // isLength: {
        //     options: [{ min: 2, max: 50   }],
        //     errorMessage: 'The name must be between 2 and 50 chars long' // Error message for the validator, takes precedent over parameter message
        // },
    },
    'pwd2': {
        errorMessage: 'This password confirmation is invalid',
        notEmpty: {
            errorMessage: 'Missing the confirmation password to be registred'
        }
    },

    'agree': {
        optional: true,
        errorMessage: 'Missing the agreement confirmation checked to be registred'
    }




};





/*********************************
 * Route for GET              *
 *********************************/


const appHandler = function(req,res,next){
    const actions = ['edit','reset','delete','export'];

    switch (req.query.action) {
        case 'edit':
            res.title = 'Edit '+ res.client.name;
            res.action = 'POST';
            break;
        case 'reset': // Reset the client accessToken
            return resetClientToken(res.client.id).then(()=>{
                res.flash('success', 'Token reset for '+res.client.name);
                return res.redirect('/apps');
            });
        case 'delete': // Reset this shitapp
            return AppsDAO.delete(res.client.id).then(() =>{
                res.flash('warning',res.client.name + ' have been removed !');
                return res.redirect('/apps');
            });
        case 'export':

            break;
        default:
            res.action = 'POST';
            res.title = 'Register a new app'

    }
    return renderCtrl.appUpsertPage(req,res);
}


/**
 * Reset the access Token of client
 *
 */
function resetClientToken(id){
    return AppsDAO.findById(id).then(function(app){
        return Util.generateSalt().then(function(secret) {
            app.set('secret',secret);
            return [app.get('id'),app.get('secret'),32];
        }).spread(Util.hashPassword)
        .then((token) => {
            app.set('accessToken',token);
            return app.save();
        });// Util.generateSalt -> hashPwd -> saveToken
    }); // AppDAO.FindById
}



/**
 * List all registred clients of the auth user.
 *
 */
const listClients = function(req, res, next) {
    AppsDAO.getUsersApps(req.user.id).then(function(apps) {
        res.apps = apps;
        next();
    });
}


/**
 * Get a requested client specified in the header
 * or in the URL parameter/query.
 *
 */
const getClient = function(req,res,next){
    let clientId;
    if (req.params.clientId) {
        req.checkParams('clientId', 'Invalid id for client').notEmpty();
        req.sanitizeParams();
        clientId = req.params.clientId;
    }else{ // Req from outside (API)
        if(req.query.client_id){
            req.checkQuery('client_id', 'Invalid id for client').notEmpty();
            req.sanitizeQuery('client_id');
            clientId = req.query.client_id;
        }else{
            // Req for /auth && has been retrieve from the headers
            clientId = (req.from) ? req.from.clientId : clientId;
        }
    }

    req.getValidationResult().then(function(result) {
        res.locals.errors = result.mapped();
        if (!result.isEmpty()) throw new new ApiError.BadRequest('Invalid data sent for client.');
        return AppsDAO.findById(clientId);
    }).then((client) => {
        if(!client) throw new ApiError.NotFound('Unknown client. Not registred');
        if((req.from)) // Req for /auth && has been retrieve from the headers
            req.client = client.toJSON();
        else
            res.client = client.toJSON();
        next();
    });

}





/*********************************
 * Route for POST                *
 *********************************/



/**
 * Entry point for POST /login
 */
const checkLoginPosted = function(req, res, next) {
    // req.checkBody(validSchema);
    req.checkBody('email', 'Missing the email to be logged in').notEmpty();
    req.checkBody('email', 'Put a valid email to be logged in').isEmail();
    req.checkBody('pwd', 'Missing the password to be logged in').notEmpty();

    req.getValidationResult().then(function(result) {
        res.locals.errors = result.mapped();
        if (!result.isEmpty())
            return next(new ApiError.BadRequest('Invalid Data sent'));
        next();
    });
}

/**
 * What to do after a successful login.
 */
const afterLoginChecked = function(req, res) {
    // By default, the cookie expires when the browser is closed.
    let cookieOpts = DEFAULT_COOKIE_OPTIONS;

    // if user want to be auto-logged ?
    if (req.body.rememberMe) {
        let exp = new Date();
        cookieOpts.maxAge = Util.DEF_COOKIE_AGE;
        exp.setTime(exp.getTime() + Util.DEF_COOKIE_AGE);
        cookieOpts.expires = exp.toGMTString();
    }

    res.cookie('accessToken', req.user.token, cookieOpts);
    res.cookie('isAuth', true, cookieOpts);

    res.flash('info', {
        title : 'Welcome back !',
        msg : 'It\'s groot to see u alive !'
    });

    res.redirect('/manage');
};


/**
 * Entry point for POST /signup
 */
const checkSignPosted = function(req, res, next) {
    req.checkBody('email', 'Missing the email to be registred').notEmpty();
    req.checkBody('email', 'Put a valid email to be registred').isEmail();
    req.checkBody('pwd', 'Missing the password to be registred').notEmpty();
    //req.checkBody('pwd', '6 to 20 characters required').len(6, 20);
    req.checkBody('pwd2', 'Missing the confirmation password to be registred').notEmpty();
    req.checkBody('pwd2', 'The two input passwords are differents').equals(req.body.pwd);
    //req.checkBody('pwd2', '6 to 20 characters required').len(6, 20);
    req.checkBody('agree', 'Missing the agreement confirmation checked to be registred').notEmpty().equals('true');

    req.getValidationResult().then(function(result) {
        res.locals.errors = result.mapped();
        return (!result.isEmpty()) ? renderCtrl.signupPage(req, res) : next();
    });

}

/**
 * What to do after a successful signup.
 */
const afterSignChecked = function(req, res, next) {
    res.flash('success', {
        title : 'Welcome onboard!',
        msg : 'You can go log in now.'
    });
    return res.redirect('/login');
};


/**
 * Handle the insert or update of a client.
 */
const upsertApp = function(req, res, next) {
    const isEditing = (req.query.action && req.query.action === "edit");
    let nApp;
    req.checkBody('appName', 'Missing the application name to be registred').notEmpty();
    req.checkBody('appName', 'The name must be between 2 and 50 chars long').len(2, 50);
    req.checkBody('appUri', 'Missing the callback URI to be registred').notEmpty();

    if (req.body.appDescrip)
        req.checkBody('appDescrip', 'Cut some description').notEmpty().len(1, 150);

    req.getValidationResult().then(function(result) {
        req.sanitizeBody();
        res.locals.errors = result.mapped();
        if (!result.isEmpty())
            return next(new ApiError.BadRequest('Invalid data sent'));
        nApp = AppsDAO.build({
            id: req.body.appId || undefined,
            name: req.body.appName,
            redirectUri: req.body.appUri,
            useRedirectUri: req.body.appUseUriAsDefault || false,
            description: req.body.appDescrip || null,
            logo : req.body.appLogo,
            owner: req.user.id
        });
        return AppsDAO.create(nApp);
    }).spread(function(client, created) {
        if(!isEditing && !created){ // req for new client but existing ?
            //res.client = req.body;
            return res.flash('warning','This name is not available');
            //return renderCtrl.appUpsertPage(req,res);
        }
        if(isEditing){ // req for editing an client
            client.update(nApp.get({plain: true}));
            res.flash('success','All odification made saved');
        }else{
            res.flash('success', client.name +' is registred');
        }
        return res.redirect('/apps');
    }).catch(function(err) {
        console.log(err);
    });
}




/*********************************
 * Route for DELETE
 *********************************/


const logout = function(req, res) {
    req.clearCookies();
    req.session = null; // Destroy session
    res.locals.isAuth = false;
    res.flash('info', 'You are disconnect !');
    res.redirect('/home');
}






/**
 * Error Handler
 */
const errorHandler = function(err, req, res, next) {
    if (!err) err = new Error('Not Found - Something went south');
    if (!err.status) err.status = 404;
/*
    if( err instanceof ApiError.Unauthorized)
        if(req.path === '/login' || req.path === '/signup' && req.method === 'GET')
            return res.redirect('/');
*/
    logger.error(err);

    renderCtrl.errorPage(err, res);
};





/**
 * Exports
 */

// Methods
module.exports = {
    loginPosted: checkLoginPosted,
    afterLogin: afterLoginChecked,

    logMeOut: logout,

    signPosted: checkSignPosted,
    afterSignin: afterSignChecked,

    appHandler : appHandler,

    listClients: listClients,

    getClient: getClient,

    upsertApp: upsertApp,



    errorHandler: errorHandler
};
