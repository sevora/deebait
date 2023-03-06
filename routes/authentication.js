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
const { signINWithGoogle, signINTEST } = require('../controllers/auth.js');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * POST /authentication/google
 * This responds with a JSON Web Token,
 * For the server it finds the right user entry in the database through their
 * Google email, if they don't exist in the database they are then created
 */
router.post('/google',signINWithGoogle);

// This is for development purposes only it allows this route to exist
if (process.env.DEVELOPMENT_MODE == 'true') {
    /**
     * POST /authentication/testing
     * This responds with a JSON Web Token,
     * Creates a new user with googleEmail to simulate
     * a successful entry
     */
    router.post('/testing',signINTEST);
}

module.exports = router;