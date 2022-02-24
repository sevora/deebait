const jwt = require('jsonwebtoken');

function decodeTokenMiddleware(request, response, next) {
    let token;
    request.decoded = {}

    try {
        token = request.headers.authorization.split(' ')[1];
    } catch (error) {
        request.decoded.error = new Error('Invalid headers.');
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, function(error, decoded) {
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

module.exports = decodeTokenMiddleware;