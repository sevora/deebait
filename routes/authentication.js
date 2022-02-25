// route for user auth
const router = require('express').Router();
const uuidv4 = require('uuid').v4;
const jwt = require('jsonwebtoken');

const User = require('../models/user.js');

router.post('/twitter', function(request, response) {
    // we just assign user as valid randomly for development
    new User({
        twitterID: (() => uuidv4())(),
    }).save(function(error, user) {
        if (error) return response.status(400).json(error);
        let token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET, { expiresIn: '24h' });
        response.status(200).json({ token });
    });
});

module.exports = router;