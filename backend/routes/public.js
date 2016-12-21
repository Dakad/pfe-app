'use strict';


const router = require('express').Router();


const publicCtrl = require('../ctrlers/public');


router.use((req,res,next) => {
    res.locals.currentUrl = req.path;
    next();
})

/* GET home page. */
router.get('/', publicCtrl.homePage);

/* GET login page. */
router.get('/login', publicCtrl.loginPage);

/* GET signup page. */
router.get('/signup', publicCtrl.signupPage);

/* GET signup page. */
router.get('/about', publicCtrl.aboutPage);




module.exports = router;
