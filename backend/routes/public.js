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
 *  login/  --> publicCtrl.loginPage
 *  signup/ --> publicCtrl.signupPage
 *  doc/    --> /
 *  documentation/ --> publicCtrl.signupPage
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


router.use((req, res, next) => {
    res.locals.currentUrl = req.path;
    next();
})

/* GET home page. */
router.get(['/', '/home'], publicCtrl.homePage);


/* GET-POST login page. */
router.route('/login')
    .get(publicCtrl.loginPage)
    .post(publicCtrl.logMe,publicCtrl.dashboardPage);


/* GET-POST signup page. */
router.route('/signup')
    .get(publicCtrl.signupPage)
    .post(publicCtrl.registerMe);


/* GET signup page. */
router.get('/about', publicCtrl.aboutPage);

/* GET documentation page. */
router.get(['/doc', '/documentation'], publicCtrl.docPage);

/* GET Dashboard page. */
router.get(['/keys', '/manage'], [publicCtrl.isAuth,publicCtrl.dashboardPage]);



// catch 404 and forward to error handler
router.use(publicCtrl.errorHandler);

// Last middleware -- Error handler - What to do when a error occurs
router.use(publicCtrl.errorPage);


/**
 * Exports
 */

// Methods

module.exports = router;