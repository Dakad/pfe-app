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


// Custom - Mine
const renderCtrl = require('./render');
const logger = require('../modules/logger');
const Util = require('../modules/util');
const ApiError = require('../modules/api-error');
const DB = require('../db/dal');
const UsersDAO = require('../db/dao/users');
const BoxesDAO = require('../db/dao/boxes');



/**
 * Variables
 *
 */


const DEFAULT_COOKIE_OPTIONS = {
    httpOnly: true,
    signed: true,
}


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
            options: [{ min: 2, max: 50   }],
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
            options: [{ max: 150  }],
            errorMessage: 'This description is too long. Cut some, please !'
        },
    },

    'email': {
        errorMessage: 'This email is invalid',
        notEmpty: {
            errorMessage : 'Missing the email to be logged in'
        },
        isEmail : {
          errorMessage : 'Put a valid email to continue'
        }
    },

    'pwd': {
        errorMessage: 'This password is invalid',
        notEmpty: {
            errorMessage : 'Missing the pwd to be logged in'
        }
        // isLength: {
        //     options: [{ min: 2, max: 50   }],
        //     errorMessage: 'The name must be between 2 and 50 chars long' // Error message for the validator, takes precedent over parameter message
        // },
    },
    'pwd2': {
        errorMessage: 'This password confirmation is invalid',
        notEmpty: {
            errorMessage : 'Missing the confirmation password to be registred'
        }
    },

    'agree': {
        optional : true,
        errorMessage : 'Missing the agreement confirmation checked to be registred'
    }




};



/**
 * Route for GET
 */


const getBox = function(req, res, next) {
    let apps ;
    if (req.params.app) {
        req.checkParams('app', 'Invalid name for this box').notEmpty();
        req.sanitizeParams();
        apps = BoxesDAO.findById(req.params.app);
    }else{
        apps = BoxesDAO.getUsersApps(req.user.id);
    }
    apps.then(function(apps) {
        res.apps = (req.params.app) ? [apps.toJSON()] : apps;
        next();
    });


}



/**
 * Route for POST
 */

const checkLoginPosted = function(req, res, next) {
    // req.checkBody(validSchema);
    req.checkBody('email', 'Missing the email to be logged in').notEmpty();
    req.checkBody('email', 'Put a valid email to be logged in').isEmail();
    req.checkBody('pwd', 'Missing the password to be logged in').notEmpty();

    req.getValidationResult().then(function(result) {
        res.locals.errors = result.mapped();
        if (result.isEmpty())
            next();
    });
}

const afterLoginChecked = function(req, res) {
    // By default, the cookie expires when the browser is closed.
    let cookieOpts = DEFAULT_COOKIE_OPTIONS;
    let exp = new Date();

    // if user want to be auto-logged ?
    if (req.body.rememberMe) {
        cookieOpts.maxAge = Util.DEF_COOKIE_AGE;
        exp.setTime(exp.getTime() + Util.DEF_COOKIE_AGE);
        cookieOpts.expires = exp.toGMTString();
    }

    res.cookie('accessToken', req.user.token, cookieOpts);
    res.cookie('isAuth', true, cookieOpts);
    // req.flash('success','Welcome back !.');
    res.redirect('manage');
}

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

const afterSignChecked = function(req, res, next) {

    req.flash('success', 'Welcome onboard !\n You can go log in now.');

    res.render('login');
};


const addBox = function(req, res, next) {
    req.checkBody('appName', 'Missing the application name to be registred').notEmpty();
    req.checkBody('appName', 'The name must be between 2 and 50 chars long').len(2,50);
    req.checkBody('appUri', 'Missing the callback URI to be registred').notEmpty();

    if(req.body.appDescrip)
        req.checkBody('appDescrip', 'Cut some description').notEmpty().len(1,150);

    req.getValidationResult().then(function(result) {
        req.sanitizeBody();
        res.locals.errors = result.mapped();
        if (!result.isEmpty())  next();
        return BoxesDAO.create({
            clientName : req.body.appName,
            clientRedirectUri : req.body.appUri,
            clientUseRedirectUri : req.body.appUseUriAsDefault || false,
            clientDescription : req.body.appDescrip || null,
            owner : req.user.id
        });
    }).then(function(app){
        res.redirect(201,'app/'+app.clientId)
    }).catch(function(err){

        console.log(err);
    });
}


/**
 * Route for DELETE
 */

const logout = function(req, res) {
    req.clearCookies();
    req.session = null; // Destroy session
    res.locals.isAuth = false;
    res.redirect('home');
}


const removeBox = function(req, res, next) {

}






/**
 * Error Handler
 */
const errorHandler = function(err, req, res, next) {
    if (!err)
        err = new Error('Not Found - Something went south');
    if (!err.status)
        err.status = 404;
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


    listBox: getBox,

    addBox: addBox,

    removeBox: removeBox,

    errorHandler: errorHandler
};
