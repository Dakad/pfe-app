'use strict';
const util = require("util");
const crypto =  require('crypto');

const Promise = require('bluebird');
const nconf = require("nconf");
const Validator = require('validator');
const _= require('lodash/core');
const jwt = require('jsonwebtoken');
const shortId = require("shortid")
const ms = require("ms");
shortId.characters('0123456789a@bcdefghijklmnopqrstuvwxyz_ABCDEFGH!JKLMNOPQR$TUVWXYZ');



/**
 * Vars
 *
 */


const DEF_COOKIE_AGE = ms((31 * 3) + 'd'); // Valid for 3 months

const DEF_TOKEN_EXP = DEF_COOKIE_AGE;





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


const checkToken = function(token,secret) {
    secret = ( (!secret) ? nconf.get('TOKEN_SECRET') : secret);
    return new Promise(function (fulfill,reject) {
        jwt.verify(token, secret, function(err, decoded) {
            return (err) ? reject(err) : fulfill(decoded);
        });
    });
}


const generateToken = function (claims,secret) {
    secret = ( (!secret) ? nconf.get('TOKEN_SECRET') : secret);
    return new Promise(function (fulfill) {
        claims.exp = (!claims.exp) ? DEF_TOKEN_EXP : claims.exp ;
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
const hashPassword = function (pwd,salt,length) {
    length = (!length) ? 64 : length;
    return Promise.resolve(crypto.pbkdf2Sync(pwd, salt, 1000,length).toString('hex'))
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





/**
 * Exports
 */

// Variables

module.exports = {

    DEF_COOKIE_AGE : DEF_COOKIE_AGE,

    DEF_TOKEN_EXP : DEF_TOKEN_EXP,
}


// Methods

module.exports = {

    valideInput : checkInput,

    generateToken : generateToken,

    validToken : checkToken,

    generateSalt : generateSalt,

    generateShortUUID : generateShortUUID,

    hashPassword : hashPassword,

    validPassword : validPassword
}




