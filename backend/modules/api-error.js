'use strict';


const jsonApiResponse = require("../public/api-response-status.json");

const SimpleError = require('simple-error');





const getError = function (status,msg) {
    let _status = 404 , _msg = jsonApiResponse['404'];

    // Check for status if provided
    if(status){
        _status = status
        if(status instanceof Error)
            _status = 404;
        if(arguments.length === 1)
            _msg = jsonApiResponse[_status+''];
    }

    // Check for msg
    if(msg){
        if(msg instanceof Error)
            _msg = msg.message;
        else
            _msg = msg;
    }

    this.status = _status;
    this.message = _msg;
};




const ApiError = SimpleError.define('ApiError',{
    status: 404,
    message: 'Not Found',
    ctor : getError
});



module.exports = ApiError;