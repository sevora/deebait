const router = require("express").Router();
const decodeTokenMiddleware = require('./decode-token.js');


router.get('/', decodeTokenMiddleware, function(request, response) {

});