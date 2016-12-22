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
 *  about/  --> publicCtrl.aboutPage
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


router.use((req,res,next) => {
    res.locals.currentUrl = req.path;
    next();
})

/* GET home page. */
router.get(['/', '/home'], publicCtrl.homePage);

/* GET login page. */
router.get('/login', publicCtrl.loginPage);

/* GET signup page. */
router.get('/signup', publicCtrl.signupPage);

/* GET signup page. */
router.get('/about', publicCtrl.aboutPage);




/**
 * Exports
 */

// Methods

module.exports = router;
