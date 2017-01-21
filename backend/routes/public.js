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
const router = require('express').Router();

// Custom -mine
const publicCtrl = require('../ctrlers/public');
const authCtrl = require('../ctrlers/auth');


router.use((req, res, next) => {
    res.locals.currentUrl = req.path;
    res.locals.host = req.protocol + '://' + req.get('host');
    next();
})

/* GET home page. */
router.get(['/', '/home'], publicCtrl.homePage);


/* GET-POST login page. */
router.route('/login')
    .get(publicCtrl.loginPage)
    .post(authCtrl.logMe);


/* GET-POST signup page. */
router.route('/signup')
    .get(publicCtrl.signupPage)
    .post(authCtrl.registerMe);


/* GET signup page. */
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