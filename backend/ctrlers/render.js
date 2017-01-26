'use strict';

/**
 * =============================
 *
 * Ctrler for render the views
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
 *		+ renderBoxAddPage()
 *		+ renderBoxListPage()
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


// Custom - Mine
const jsonDocFormat = require("../public/cheatsheet-help");





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

const renderBoxListPage = function(req, res) {
    return res.render('box-list', {
        title : 'List of registred apps',
        'boxes' : res.apps
    });
}

const renderBoxAddPage = function(req, res) {
    return res.render('box-add', {
        title : 'Register a new app'
    });
}


const renderErrorPage = function(err, res, next) {
    // set locals, only providing error in development
    res.locals.err = err;
    res.locals.msg = err.message;
    res.locals.status = err.status;
    res.locals.title = err.title || 'Error'
    res.status(err.status || 500).render('error');
};







/**
 * Exports
 */

// Methods
module.exports = {
    homePage: renderHomePage,

    loginPage: renderLoginPage,

    signupPage: renderSignupPage,

    docPage : renderDocPage,

    boxListPage: renderBoxListPage,

    boxAddPage: renderBoxAddPage,

    trainingPage: renderExePage,

    aboutPage: renderAboutPage,

    errorPage: renderErrorPage,
};


