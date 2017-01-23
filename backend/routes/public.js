'use strict';

/**
 * =============================
 *
 * Route for /public/*
 *
 * =============================
 *
 * Attributes :
 *
 * Routes   --> Ctrler :
 *      /   --> publicCtrl.homePage
 *  home/  --> publicCtrl.aboutPage
 *  about/  --> publicCtrl.aboutPage
 *  doc/    --> publicCtrl.docPage
 *  exe/    --> publicCtrl.trainingPage
 *  login/  --> publicCtrl.loginPage
 *  signup/ --> publicCtrl.signupPage
 *
 *
 * =============================
 */


/**
 * Load modules dependencies.
 */
// Built-in
const nconf = require('nconf');
const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const expresMessages = require('express-messages');
const cookieParser  = require('cookie-parser')
const cookieSession = require('cookie-session')


// Custom -mine
const publicCtrl = require('../ctrlers/public');
const authCtrl = require('../ctrlers/auth');






router.init = function (){
    router.use(flash());


    router.use(cookieParser(nconf.get('COOKIE_SECRET')));

    router.use(cookieSession({
        keys : [ nconf.get('COOKIE_SECRET')],
        secret : nconf.get('COOKIE_SECRET'),
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 Week
        httpOnly : true,
    }));

}


// First Middleware to handle an incoming request
router.use((req, res, next) => {

    res.locals.currentUrl = req.path;
    res.locals.input = req.body;
//    res.locals.messages = expresMessages(req,res);
    next();
});



/* GET home page. */
router.get(['/', '/home'], publicCtrl.homePage);


/* GET-POST login page. */
router.route('/login')
    .get(publicCtrl.loginPage)
    .post([publicCtrl.loginPosted,authCtrl.logMe, publicCtrl.afterLogin]);



/* GET-POST signup page. */
router.route('/signup')
    .get(publicCtrl.signupPage)
    .post([publicCtrl.signPosted,authCtrl.registerMe,publicCtrl.signupPage]);

/* GET about page. */
router.get('/logout', publicCtrl.logMeOut);



/* GET about page. */
router.get('/about', publicCtrl.aboutPage);

/* GET documentation page. */
router.get(['/exe', '/training'], publicCtrl.trainingPage);

/* GET documentation page. */
router.get(['/doc', '/documentation'], publicCtrl.docPage);

/* GET Dashboard page. */
router.get(['/keys', '/manage'], [authCtrl.isLogged, publicCtrl.dashboardPage]);



// catch 404 and forward to error handler
router.use(publicCtrl.errorHandler);


// Last middleware -- Error handler - What to do when a error occurs
router.use(publicCtrl.errorPage);



/**
 * Exports
 */

// Methods

module.exports = router;