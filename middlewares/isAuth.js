const jwt = require('jsonwebtoken')
/**
 * 
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns decoded token
 * @description This middleware is used to decode the token
 * and check if the user is authenticated.
 */
exports.isAuth = (req,res,next) => {
    try{
        const {authorization} = req.headers
        if(!authorization){
            return res.status(401).json({message: 'Unauthorized'})
        }
        const [type, token] = authorization.split(' ')
        if(type !== 'Bearer'){
            const error = new Error('Unauthorized')
            error.statusCode = 401
            throw error
        }
        let decoded;
        try{
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        }catch(e){
            const error = new Error('Unauthorized')
            error.statusCode = 401
            throw error
        }
        req.decoded = decoded
        next()
    }catch (e){
        if(!e.statusCode){
            e.statusCode = 500
        }
        next(e)
    }
}
/**
 * Custom middleware to handle bad decode request 
 * when using the JWT.
 * @param {Request} request
 * @param {Response} response
 * @param {NextFunction} next
 */
exports.handleBadDecodedRequest = (request, response, next) => {
    if (request.decoded.error) {
        if (request.decoded.expired) {
            response.status(400).send({ title: 'Session Expired', message: 'Please log-in again.' });
        } else {
            response.status(400).send({ title: 'Internal Server Error', message: 'Please try again later.' });
        }
    } else {
        next();
    }
}

exports.decodeToken = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    resolve({ expired: true, error: true });
                } else {
                    resolve({ error: true });
                }
            } else {
                resolve(decoded);
            }
        })
    })
}