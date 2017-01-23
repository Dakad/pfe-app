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
const logger = require('../modules/logger');
const Util = require('../modules/util');
const DB = require('../models');
const jsonDocFormat = require("../public/cheatsheet-help");


const COOKIE_OPTIONS = {
    maxAge      : new Date(Date.now() + 900000),
    httpOnly    : true,
    signed      : true,
    //expires: new Date(Date.now() + (24 *  1000 * 60 * 60 * 24)),
    expires     : new Date(Date.now() + 900000),
}



const renderHomePage = function(req, res) {
    res.render('home', { title: 'PFE App' });
};

const renderLoginPage = function(req, res) {
    res.render('login', { title: 'Sign in to continue' });
};

const renderSignupPage = function(req, res) {
    res.render('signup', { title: 'Register a new user' });
};

const renderDocPage = function(req, res) {
    res.render('doc', {
        title: 'API Documentation',
        format: jsonDocFormat,
        urlApi: req.protocol + '://' + req.get('host') + '/api/v1'
    });
};

const renderExePage = function(req, res) {
    res.render('exe', { title: 'Little training before the project' });
};

const logout = function (req,res) {
    req.clearCookies();
    req.session = null; // Destroy session
    res.locals.isAuth = false;
    res.redirect('home');
}



const renderAboutPage = function(req, res) {
    res.render('about', {
        title: 'About the dev team of this marvellous app',
        team: [{
            name: 'Dakad',
            avatar: 'https://avatars3.githubusercontent.com/u/3106338?v=3&s=400',
            git: 'https://github.com/Dakad?tab=repositories&type=source',
            fb: 'https://github.com/Dakad?tab=repositories&type=source',
            twit: 'https://github.com/Dakad?tab=repositories&type=source',
            lkdin: 'https://github.com/Dakad?tab=repositories&type=source',
        }, {
            name: 'Tegawende',
            avatar: 'https://avatars3.githubusercontent.com/u/20798720?v=3&s=400',
            git: 'https://github.com/Tegawende'
        }, ]

    });
};

const renderDashboardPage = function(req, res) {
    // Go fetch the real boxes for this user
    return res.render('dashboard', {
        'title': 'Your API Wallet',
        'apiId': 'test',
        'apiKey': '915cd41e9-b16d4378fa-448ed92f-104f-585ffb8ffc13ae1770000084'
    });
}

const renderErrorPage = function(err, res, next) {
    // set locals, only providing error in development
    res.locals.err = err;
    res.locals.msg = err.message;
    res.locals.status = err.status;
    res.locals.title = err.title || 'Error'
    logger.error(err);
    res.status(err.status || 500).render('error');
};





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
        return (!result.isEmpty()) ? renderSignupPage(req,res) :  next() ;
    });

}


const afterSignChecked = function (req,res,next) {

    req.flash('success','Welcome onboard !\n You can go log in now.');

    res.render('login');
}




/**
 * Error Handler
 */
const errorHandler = function(err, req, res, next) {
    if(!err)
        err = new Error('Not Found - Something went south');
    if(!err.status)
        err.status = 404;

    renderErrorPage(err, res);
}





/**
 * Exports
 */

// Methods
module.exports = {
    homePage: renderHomePage,

    loginPage: renderLoginPage,
    loginPosted : checkLoginPosted,
    afterLogin : afterLoginChecked,

    logMeOut: logout,

    signupPage: renderSignupPage,
    signPosted : checkSignPosted,
    afterSignin : afterSignChecked,

    dashboardPage: renderDashboardPage,

    docPage: renderDocPage,

    trainingPage: renderExePage,

    aboutPage: renderAboutPage,

    errorPage: renderErrorPage,
    errorHandler: errorHandler
};