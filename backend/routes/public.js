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
    router.use(cookieParser(nconf.get('APP_COOKIE_SECRET')));

}


// First Middleware to handle an incoming request
router.use((req, res, next) => {
    // Locals available during the request lifetime
    // and served to the rendered page.
    res.locals.currentUrl = req.path;
    res.locals.input = req.body; // Get the inputted form
    res.locals.flashMsg = req.cookies.flashMsg; // Get saved flashMsg
    res.clearCookie('flashMsg'); // Delete the saved msg;

    // To save flash msg into cookies for the next call.
    res.flash = function (type,msg) {
        let flashMsg = req.cookies.flashMsg;
        if(!flashMsg || !flashMsg[type]){
            flashMsg = {};
            flashMsg[type] = [];
        }
        if(typeof msg === 'string' )
            msg = {'title':'','msg':msg}
        flashMsg[type].push(msg);
        res.cookie('flashMsg', flashMsg, { httpOnly: true });
        res.locals.flashMsg = flashMsg;
    }


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
    .post([publicCtrl.signPosted,authCtrl.registerMe,publicCtrl.afterSignin]);

/* GET about page. */
router.get('/logout', publicCtrl.logMeOut);



/* GET about page. */
router.get('/about', renderCtrl.aboutPage);

/* GET documentation page. */
router.get(['/exe', '/training'], renderCtrl.trainingPage);

/* GET documentation page. */
router.get(['/doc', '/documentation'], renderCtrl.docPage);

/* GET registred Apps page. */
router.param('clientId', publicCtrl.getClient);
router.get(['/apps', '/manage'],
        authCtrl.isLogged, publicCtrl.listClients, renderCtrl.appListPage)

router.get('/apps/:clientId',
        authCtrl.isLogged, publicCtrl.getClient, renderCtrl.appListPage)


// POST new app - DELETE
router.route('/app/(:clientId)?')
        .all(authCtrl.isLogged)
        .get(publicCtrl.appHandler) // Get the page to add new app
        .post(publicCtrl.upsertApp) // Adding or editing new app
//        .delete(publicCtrl.deleteApp) // Delete this page



// catch 404 and forward to error handler
router.use(publicCtrl.errorHandler);


// Last middleware -- Error handler - What to do when a error occurs
router.use(renderCtrl.errorPage);



/**
 * Exports
 */

// Methods

module.exports = router;