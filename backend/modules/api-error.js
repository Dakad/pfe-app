'use strict';


const jsonApiResponse = require("../public/api-response-status.json");

const SimpleError = require('simple-error');





const getError = function (status,msg) {
    let _status = 404 , _msg = jsonApiResponse['404'];

    // Check for status provided ?
    if(status){
        _status = (status instanceof Error) ? 404 : status;
        if(arguments.length === 1) // Only called with status, no msg
            _msg = jsonApiResponse[_status+''];
    }

    // Check msg is :Error ?
    if(msg)
        _msg = (msg instanceof Error) ? msg.message : msg;

    this.status = _status;
    this.message = _msg;
};




const ApiError = SimpleError.define('ApiError',{
    status: 404,
    message: 'Not Found',
    ctor : getError
});




/**
 * All possbile Error coming from the API.
 *
 */

ApiError.NoContent = SimpleError.define('ApiError',{ status: 204 });

ApiError.BadRequest = SimpleError.define('ApiError',{ status: 400 });

ApiError.Unauthorized = SimpleError.define('ApiError',{ status: 401 });

ApiError.Forbidden = SimpleError.define('ApiError',{ status: 403 });

ApiError.NotFound = SimpleError.define('ApiError');

ApiError.MethodNotAllowed = SimpleError.define('ApiError',{ status: 405 });

ApiError.Conflict = SimpleError.define('ApiError',{ status: 409 });

ApiError.InternalError = SimpleError.define('ApiError',{ status: 500 });





module.exports = ApiError;