/**
 * 
 */
require('dotenv').config();

const router = require('express').Router();
const uuidv4 = require('uuid').v4;
const { resolve } = require('../helper.js');

const User = require('../models/user.js');
const { OAuth2Client } = require('google-auth-library');

const jwt = require('jsonwebtoken');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * POST /authentication/google
 * This responds with a JSON Web Token,
 * For the server it finds the right user entry in the database through their
 * Google email, if they don't exist in the database they are then created
 */
router.post('/google', function(request, response) {
    if (!request.body || !request.body.tokenId) return response.status(400).json('No user specified.')

    const { tokenId } = request.body;
    
    googleClient.verifyIdToken({ idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID })
        .then(async (googleResponse) => {    

            // only verified emails are allowed
            const { email_verified, name, email } = googleResponse.payload;
            if (!email_verified) return response.status(400).json('Please use a verified Google account.')

            let [user, userError] = await resolve ( User.findOne({ googleEmail: email }) );

            if (userError) {
                try {
                    user = await (new User({ googleEmail: email }).save());
                } catch (error) {
                    return response.status(400).json('Could not create account.')
                }
            }

            let token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET, { expiresIn: '24h' });
            response.status(200).json({ token });
        });
});

// This is for development purposes only it allows this route to exist
if (process.env.DEVELOPMENT_MODE == 'true') {
    /**
     * POST /authentication/testing
     * This responds with a JSON Web Token,
     * Creates a new user with googleEmail to simulate
     * a successful entry
     */
    router.post('/testing', function(request, response) {
        // we just assign user as valid randomly for development
        new User({
            googleEmail: (() => uuidv4())(),
        }).save(function(error, user) {
            if (error) return response.status(400).json(error);
            let token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET, { expiresIn: '7d' });
            response.status(200).json({ token });
        });
    });
}

module.exports = router;