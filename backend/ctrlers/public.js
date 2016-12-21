'use strict';


var renderHomePage = function (req,res,next) {
    res.render('home', {title : 'PFE App'});  
};


var renderLoginPage = function (req,res,next) {
    res.render('login', {title : 'Sign in to continue'});  
};


var renderSignupPage = function (req,res,next) {
    res.render('signup', {title : 'Register a new user'});  
};


var renderAboutPage = function (req,res,next) {
    res.render('about',{
        title   : 'About the dev team of this marvellous app',
        team    : [
            {
                name    :'Dakad', 
                avatar  : 'https://avatars3.githubusercontent.com/u/3106338?v=3&s=400',
                git     : 'https://github.com/Dakad?tab=repositories&type=source',
                fb      : 'https://github.com/Dakad?tab=repositories&type=source',
                twit    : 'https://github.com/Dakad?tab=repositories&type=source',
                lkdin   : 'https://github.com/Dakad?tab=repositories&type=source',
            },{
                name    :'Tegawende', 
                avatar  : 'https://avatars3.githubusercontent.com/u/20798720?v=3&s=400',
                git  : 'https://github.com/Tegawende'
            },   
        ]
    
    });  
};





module.exports = {
    homePage : function(req,res,next){
        renderHomePage(req,res);
    }
    
    ,loginPage : function(req,res,next){
        renderLoginPage(req,res);
    } 
    
    ,signupPage : function(req,res,next){
        renderSignupPage(req,res);
    }
    
    ,aboutPage  : function (req,res,next){
        renderAboutPage(req,res);
    }
    
};