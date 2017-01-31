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
 *		+ renderAppUpsertPage()
 *		+ renderAppListPage()
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
const unless = require('express-unless');

// Custom - Mine
const jsonDocFormat = require("../static/cheatsheet-help");
const devTeam = require("../static/dev-team");





const renderHomePage = function(req, res) {
    res.render('home', { title: 'PFE App' });
};

const renderLoginPage = function(req, res) {
    res.render('user/login', { title: 'Sign in to continue' });
};
renderLoginPage.unless = unless;

const renderSignupPage = function(req, res) {
    res.render('user/signup', { title: 'Register a new user' });
};
renderSignupPage.unless = unless;


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
        team: devTeam
    });
};

const renderAppListPage = function(req, res) {
      res.render('app/list', {
        title : 'List of your registred apps',
        apps : res.apps || [res.client]
    });
};

const renderAppUpsertPage = function(req, res) {
    return res.render('app/upsert', {
        title : res.title,
        action: res.action,
        client : res.client
    });
}


const renderDialogPage = function (req,res,next){
    return res.render('dialog',{
        title : 'Grant access to ' + res.client.name,
        client : res.client ,
        user   : req.user
    });
}



const renderErrorPage = function(err, res, next) {
    // set locals, only providing error in development
    res.locals.err = err;
    res.locals.msg = err.message;
    res.locals.status = err.status;
    res.locals.title = err.title || 'Error'
    return res.status(err.status || 500).render('error');
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

    appListPage: renderAppListPage,

    appUpsertPage: renderAppUpsertPage,

    trainingPage: renderExePage,

    aboutPage: renderAboutPage,

    dialogPage: renderDialogPage,


    errorPage: renderErrorPage,
};


