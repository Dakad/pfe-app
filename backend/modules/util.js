'use strict';

const crypto =  require('crypto');
const Promise = require('promise');
const nconf = require("nconf");
const Validator = require('validator');
const _= require('lodash/core');
const jwt = require('jsonwebtoken');
const shortId = require("shortid")

shortId.characters('0123456789@bcdefghijklmnopqrstuµvwxyz_AßCD€FGH!JKLMNOPQR$TUVWXYZ');



const checkInput = function(input){
    return new Promise(function (fulfill, reject){
        const errors = {};

        if (Validator.isEmpty(input.email)) {
            errors.email = 'Must provide an Email';
        }else{
            if (!Validator.isEmail(input.email))
                errors.email = 'Your email is invalid';
        }

        if (Validator.isEmpty(input.pwd))
            errors.pwd = 'Must provide your password';

        if (input.pwd2 && Validator.isEmpty(input.pwd2)) {
            errors.pwd2 = 'Must provide your password confirmation';
        }else{
            if(input.pwd2 && !Validator.equals(input.pwd,input.pwd2))
                errors.pwd = 'Must provide your password confirmation';
        }
        return (_.isEmpty(errors) ? fulfill(true) :  reject(errors));
    });

};


const checkToken = function(token) {

}


const generateToken = function (claims,secret) {
    secret = ( (!secret) ? nconf.get('TOKEN_SECRET') : secret);
    return new Promise(function (fulfill) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 21); // Valid for 21 days

        claims.exp = parseInt(expiry.getTime() / 1000)

        return fulfill(jwt.sign(claims,secret));
    });

}

/**
 * Generate a salt(Random Hex characters).
 *
 */
const generateSalt = function (){
    return Promise.resolve(crypto.randomBytes(32).toString('hex'));
}


/**
 * Hash the password with a givem salt.
 *
 */
const hashPassword = function (pwd,salt) {
    return Promise.resolve(crypto.pbkdf2Sync(pwd, salt, 1000,64).toString('hex'))
}


/**
 * Check if the plain given password + salt === hashed password.
 *
 *
 */
const validPassword = function (pwd,salt,hashPassword) {
    return new Promise(function (fulfill) {
        return fulfill(_.isEqual(hashPassword,crypto.pbkdf2Sync(pwd, salt, 1000, 64).toString('hex')));
    });
}

const generateShortUUID = function(){
    return shortId.generate();
}



module.exports = {
    valideInput : checkInput
    ,
    generateToken : generateToken
    ,
    valideToken : checkToken
    ,
    generateSalt : generateSalt
    ,
    generateShortUUID : generateShortUUID
    ,
    hashPassword : hashPassword
    ,
    validPassword : validPassword
}




