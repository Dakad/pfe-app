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
const nconf = require('nconf');

// Custom -Mine
const logger = require('../modules/logger');


var renderHomePage = function(req, res) {
    res.render('home', { title: 'PFE App' });
};


var renderLoginPage = function(req, res) {
    res.render('login', { title: 'Sign in to continue' });
};


var renderSignupPage = function(req, res) {
    res.render('signup', { title: 'Register a new user' });
};


var renderDocPage = function(req, res) {
    res.render('doc', { title: 'API Documentation' });
};


var renderAboutPage = function(req, res) {
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


var renderErrorPage = function(err, res, next) {
    console.log(nconf.get('env'));
    // set locals, only providing error in development
    res.locals.msg = err.message;
    logger.error(err);
    res.status(err.status || 500).render('error');
};

/**
 * Error Handler
 */
var errorHandler = function(req, res, next) {
    var err = new Error('Not Found - Something went south');
    err.status = 404;
    renderErrorPage(err, res);
}


/**
 * Exports
 */

// Methods
module.exports = {
    homePage: function(req, res) {
        renderHomePage(req, res);
    }

    ,
    loginPage: function(req, res) {
        renderLoginPage(req, res);
    }

    ,
    signupPage: function(req, res) {
        renderSignupPage(req, res);
    }

    ,
    docPage: function(req, res) {
        renderDocPage(req, res);
    }

    ,
    aboutPage: function(req, res) {
        renderAboutPage(req, res);
    },
    errorPage: function(err, req, res) {
        renderErrorPage(err, res);
    }

    ,
    errorHandler: errorHandler
};