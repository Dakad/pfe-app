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
const ApiError = require('../modules/api-error');
const logger = require('../modules/logger');
const Util = require('../modules/util');
const userDAO = require('../models/users');
const jsonDocFormat = require("../public/cheatsheet-help.json");




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
        urlApi: res.locals.host + '/api/v1' 
    });
};


const renderExePage = function(req, res) {
    res.render('exe', { title: 'Little training before the project' });
};

const logout = function (rq,res) {
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
    res.render('dashboard', {
        'title': 'Your API Wallet',
        'apiID': 'test',
        'apiKey': '915cd41e9-b16d4378fa-448ed92f-104f-585ffb8ffc13ae1770000084'
    });
}

const renderErrorPage = function(err, res, next) {
    // set locals, only providing error in development
    res.locals.msg = err.message;
    logger.error(err);
    res.status(err.status || 500).render('error');
};





/**
 * Route for POST
 */

 const checkLoginPosted = function(req,res,next){
    if(!req.body)
        return next(new ApiError(400,'Missing information on the user to be logged'));
    if(!req.body.mail)
        return next(new ApiError(400,'Missing the mail to be logged'));
    if(!req.body.pwd)
        return next(new ApiError(400,'Missing the password to be logged'));

    return next();
 }

const afterLoginChecked = function (req,res) {
    res.locals.isAuth = true;
    res.redirect('manage');
}


 const checkSignPosted = function(req,res,next){

    if(!req.body)
        return next(new ApiError(400,'Missing information on the user to be registred'));
    if(!req.body.mail)
        return next(new ApiError(400,'Missing the mail to be registred'));
    if(!req.body.pwd)
        return next(new ApiError(400,'Missing the password to be registred'));
    if(!req.body.confirmPwd)
        return next(new ApiError(400,'Missing the confirmation password to be registred'));
    if(req.body.pwd !== req.body.confirmPwd)
        return next(new ApiError(400,'The two input passwords are differents'));
    if(!req.body.agree)
        return next(new ApiError(400,'Missing the agreement confirmation checked to be registred'));

     return next();
 }


const afterSignChecked = function (req,res,next) {
    res.locals.flash = {
        'type'  : 'success',
        'title' : 'New User',
        'msg'   : 'Welcome onboard !\n You can go log in now.'
    }

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