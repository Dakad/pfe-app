'use strict';

const crypto =  require('crypto');
const Promise = require('promise');
const Validator = require('validator');
const _= require('lodash/core');
const jwt = require('jsonwebtoken');


const checkInput = function(input){
    return new Promise(function (fulfill, reject){
        const errors = {};

        if (Validator.isEmpty(input.email)) {
            errors.email = 'Must provide an Email';
        }else{
            if (!Validator.isEmail(input.email)) {
                errors.email = 'Your email is invalid';
            }
        }

        if (Validator.isEmpty(input.pwd)) {
            errors.pwd = 'Must provide your password';
        }

        if (input.pwd2 && Validator.isEmpty(input.pwd2)) {
            errors.pwd2 = 'Must provide your password confirmation';
        }

        return (_.isEmpty(errors) ? reject(errors) :  fulfill(true));
    });

};


const checkToken = function(token) {

}


const generateToken = function (claims,secret) {
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
const hashPassword = function (salt,pwd) {
    return Promise.resolve(crypto.pbkdf2Sync(pwd, salt, 1000,64).toString('hex'))
}


/**
 * Check if the plain given password + salt === hashed password.
 *
 *
 */
const validPassword = function (pwd,salt,hashPassword) {
    return new Promise(function (fulfill, reject) {
        var hash = crypto.pbkdf2Sync(pwd, salt, 1000, 64).toString('hex');
        return (_.isEqual(hash,hashPassword) ? fulfill(true) : reject(new Error('Not valid password')));
    });
}





module.exports = {
    valideInput : checkInput
    ,
    generateToken : generateToken
    ,
    valideToken : checkToken
}




