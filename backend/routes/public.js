'use strict';

/**
 * =============================
 *
 * Route for /*
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
const renderCtrl = require('../ctrlers/render');
const publicCtrl = require('../ctrlers/public');
const authCtrl = require('../ctrlers/auth');






router.init = function (){
    router.use(flash());

    router.use(cookieParser(nconf.get('COOKIE_SECRET')));

    router.use(cookieSession({
        keys : [ nconf.get('COOKIE_SECRET')],
        secret : nconf.get('COOKIE_SECRET'),
        maxAge: 24 * 60 * 60, // 1 Week
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
router.get(['/', '/home'], renderCtrl.homePage);


/* GET-POST login page. */
router.route('/login')
    .get(renderCtrl.loginPage)
    .post([publicCtrl.loginPosted,authCtrl.logMe, publicCtrl.afterLogin]);



/* GET-POST signup page. */
router.route('/signup')
    .get(renderCtrl.signupPage)
    .post([publicCtrl.signPosted,authCtrl.registerMe,renderCtrl.signupPage]);

/* GET about page. */
router.get('/logout', publicCtrl.logMeOut);



/* GET about page. */
router.get('/about', renderCtrl.aboutPage);

/* GET documentation page. */
router.get(['/exe', '/training'], renderCtrl.trainingPage);

/* GET documentation page. */
router.get(['/doc', '/documentation'], renderCtrl.docPage);

/* GET registred Apps page. */
router.param('appName', publicCtrl.listBox)
router.get(['/apps(/:appName)?', '/manage(/:appName)?'],
        authCtrl.isLogged, publicCtrl.listBox, renderCtrl.boxListPage)

router.route('/app')
        .all(authCtrl.isLogged)
        .get(renderCtrl.boxAddPage)
        .post(publicCtrl.listBox, publicCtrl.addBox)
        .delete(publicCtrl.removeBox)


// catch 404 and forward to error handler
router.use(publicCtrl.errorHandler);


// Last middleware -- Error handler - What to do when a error occurs
router.use(renderCtrl.errorPage);



/**
 * Exports
 */

// Methods

module.exports = router;