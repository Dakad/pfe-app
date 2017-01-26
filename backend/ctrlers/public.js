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
const DB = require('../models');


const COOKIE_OPTIONS = {
    maxAge      : new Date(Date.now() + 900000),
    httpOnly    : true,
    signed      : true,
    //expires: new Date(Date.now() + (24 *  1000 * 60 * 60 * 24)),
    expires     : new Date(Date.now() + 900000),
}






/**
 * Route for GET
 */


const getBox = function(req,res,next) {
    let result = DB.User.findOne({
            where: { email : req.user.email}
        }).then(function(user){
            console.log(user);
            console.log(user.getBoxes());
        });
    if(req.param.app){
        req.checkParams('app', 'Invalid name for this box').notEmpty().isAlphanumeric();
        req.sanitizeParams();
    }else{

    }
}



/**
 * Route for POST
 */

const checkLoginPosted = function(req,res,next){
    req.checkBody('email', 'Missing the email to be logged in').notEmpty();
    req.checkBody('email', 'Put a valid email to be logged in').isEmail();
    req.checkBody('pwd', 'Missing the password to be logged in').notEmpty();

    req.getValidationResult().then(function(result) {
        res.locals.errors = result.mapped();
        if(result.isEmpty())
            next() ;
    });
 }

const afterLoginChecked = function (req,res) {
    // Check if re.body.remember is check
    // then create a cookie and store
    if(req.body.rememberMe)
        // Save the token in req.locals.accesToken intro cookie['acccess_token']
        res.cookie('acccess_token',req.user.token,COOKIE_OPTIONS);

    console.log(req.user);


    res.cookie('isAuth', true, COOKIE_OPTIONS);
    // req.flash('success','Welcome back !.');
    res.redirect('manage');
}

const checkSignPosted = function(req,res,next){
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
        return (!result.isEmpty()) ? renderCtrl.signupPage(req,res) :  next() ;
    });

}

const afterSignChecked = function (req,res,next) {

    req.flash('success','Welcome onboard !\n You can go log in now.');

    res.render('login');
};


const addBox = function (req,res,next) {
    console.log(req.param);
}


/**
 * Route for DELETE
 */

const logout = function (req,res) {
    req.clearCookies();
    req.session = null; // Destroy session
    res.locals.isAuth = false;
    res.redirect('home');
}


const removeBox = function (req,res,next) {

}








/**
 * Error Handler
 */
const errorHandler = function(err, req, res, next) {
    if(!err)
        err = new Error('Not Found - Something went south');
    if(!err.status)
        err.status = 404;
    logger.error(err);

    renderCtrl.renderErrorPage(err, res);
};





/**
 * Exports
 */

// Methods
module.exports = {

    loginPosted : checkLoginPosted,
    afterLogin : afterLoginChecked,

    logMeOut: logout,

    signPosted : checkSignPosted,
    afterSignin : afterSignChecked,


    listBox  : getBox,

    addBox  : addBox,

    removeBox : removeBox,

    errorHandler: errorHandler
};