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

// Custom -Mine
const logger = require('../modules/logger');
const Util = require('../modules/util');
const userDAO = require('../models/users');
const jsonDocFornat = require("../public/cheatsheet-help.json");




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
    res.render('doc', { title: 'API Documentation', format: jsonDocFornat });
};

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
 * Error Handler
 */
const errorHandler = function(req, res, next) {
    const err = new Error('Not Found - Something went south');
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

    signupPage: renderSignupPage,

    dashboardPage: renderDashboardPage,

    docPage: renderDocPage,

    aboutPage: renderAboutPage,

    errorPage: renderErrorPage,
    errorHandler: errorHandler
};