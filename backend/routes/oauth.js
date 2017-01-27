'use strict';

/**
 * =============================
 *
 * Ctrler for the api oAuth for /oauth/*
 * All methods receive (req:Request,res:Response,next:Middleware)
 *
 *
 * =============================
 *
 * Attributes : /
 *
 * Methods : /
 *		+ renderLoginPage()

 *
 * Events : /
 * =============================
 */


/**
 * Load modules dependencies.
 */
// Built-in
const express = require('express');


// Custom -Mine
const Util = require('../modules/util');
const ApiError = require('../modules/api-error');
const authCtrl = require('../ctrlers/auth');
const publicCtrl = require('../ctrlers/auth');
const renderCtrl = require('../ctrlers/render');





/**
 * Variables
 *
 */
const router = express.Router();





router.init = function() {


}



// Post token.
router.post('/token', function(req,res,next){
    authCtrl.getOAuth().token();
});

/*
// Get authorization.
router.get('/grant', function(req, res) {
  // Redirect anonymous users to login page.
  if (!req.locals.user) {
    return res.redirect(util.format('/login?redirect=%s&client_id=%s&redirect_uri=%s', req.path, req.query.client_id, req.query.redirect_uri));
  }

  return res.render('dialog', {
    client_id: req.query.client_id,
    redirect_uri: req.query.redirect_uri
  });
});
*/

// Get authorization.
router.get('/grant', renderCtrl.dialogPage)



// // Post authorization.
// router.post('/authorize', function(req, res) {
//   // Redirect anonymous users to login page.
//   if (!req.app.locals.user) {
//     return res.redirect(util.format('/login?client_id=%s&redirect_uri=%s', req.query.client_id, req.query.redirect_uri));
//   }

//   return app.oauth.authorize();
// });



// // Get login.
// router.get('/login', function(req) {
//   return render('login', {
//     redirect: req.query.redirect,
//     client_id: req.query.client_id,
//     redirect_uri: req.query.redirect_uri
//   });
// });

// // Post login.
// router.post('/login', function(req, res) {
//   // @TODO: Insert your own login mechanism.
//   if (req.body.email !== 'thom@nightworld.com') {
//     return render('login', {
//       redirect: req.body.redirect,
//       client_id: req.body.client_id,
//       redirect_uri: req.body.redirect_uri
//     });
//   }

//   // Successful logins should send the user back to /oauth/authorize.
//   var path = req.body.redirect || '/home';

//   return res.redirect(util.format('/%s?client_id=%s&redirect_uri=%s', path, req.query.client_id, req.query.redirect_uri));
// });


// Get secret.
router.get('/secret', authCtrl.getOAuth().authorize(), function(req, res) {
  // Will require a valid access_token.
  res.send('Secret area');
});











/**
 * Exports
 */

// Methods

module.exports = router;
