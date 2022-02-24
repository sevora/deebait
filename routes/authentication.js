const router = require('express').Router();
const User = require('../models/user.js');
const uuidv4 = require('uuid').v4;
const jwt = require('jsonwebtoken');

router.post('/twitter', function(request, response) {
    // we just assign user as valid randomly for development
    new User({
        twitterID: uuidv4(),
        userID: uuidv4()
    }).save(function(error, user) {
        if (error) return response.status(400).json(error);
        let token = jwt.sign({ twitterID: user.userID }, process.env.JWT_SECRET, { expiresIn: '24h' });
        response.status(200).json({ token });
    });
});

module.exports = router;