const { resolve } = require('../helper.js');

const User = require('../models/user.js');
const { OAuth2Client } = require('google-auth-library');

const jwt = require('jsonwebtoken');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



exports.signINWithGoogle = async (request, response, next) => {
    try {
        if (!request.body || !request.body.tokenId) return response.status(400).json('No user specified.')

        const { tokenId } = request.body;
        googleClient.verifyIdToken({ idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID })
            .then(async (googleResponse) => {

                // only verified emails are allowed
                const { email_verified, name, email } = googleResponse.payload;
                if (!email_verified) return response.status(400).json('Please use a verified Google account.')

                let [user, userError] = await resolve(User.findOne({ googleEmail: email }));

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
    } catch (e) {
        error.statusCode = error.statusCode || 500;
        next(e)
    }
}

exports.signINTEST = async (request, response) => {
    try {
        new User({
            googleEmail: (() => uuidv4())(),
        }).save(function(error, user) {
            if (error) return response.status(400).json(error);
            let token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET, { expiresIn: '7d' });
            response.status(200).json({ token });
        });
    } catch (e) {
        error.statusCode = error.statusCode || 500;
        next(e)
    }
}