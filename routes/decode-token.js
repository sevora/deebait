// JSON web tokens are vulnerable to XCSRF attacks,
// so apparently it's better to avoid it if possible.
// I won't. Sorry.
const jwt = require('jsonwebtoken');

/**
 * Use this to decode Strings (presumable JWT Strings) to get their actual values.
 * @param token A String following a valid JWT format.
 * @param callback Function to call when decoding of token is successful.
 */
function decodeToken(token, callback) {
    jwt.verify(token, process.env.JWT_SECRET, function(error, decoded) {
        if (error) {
            return callback(error, null);
        }
        callback(null, decoded);
    });   
}

/**
 * This is a middleware for express to parse 
 * headers for JWT token.
 * @param request 
 * @param response 
 * @param next 
 */
function decodeTokenMiddleware(request, response, next) {
    let token;
    request.decoded = {}

    // If we reach the catch statement 
    // it just means the token doesn't exist. 
    try {
        token = request.headers.authorization.split(' ')[1];
    } catch (error) {
        request.decoded.error = new Error('Invalid headers.');
        return next();
    }

    decodeToken(token, function(error, decoded) {
        if (error) {
            request.decoded.error = error;
            
            if (error.name == 'TokenExpiredError') {
                request.decoded.expired = true;
            }
            return next();
        }

        request.decoded = decoded;
        return next();
    });
}

module.exports = { decodeToken, decodeTokenMiddleware };