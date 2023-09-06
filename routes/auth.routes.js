const { Router } = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model');

// GET route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));

// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
    console.log('The form data: ', req.body);

const { username, email, password } = req.body;

bcryptjs
.genSalt(saltRounds)
.then(salt => bcryptjs.hash(password, salt)) 
// once the salt is generated successfully, the code inside the .then block will execute. 
// The salt variable inside the block holds the generated salt value.
// .hash(password, salt) => a function call that hashes the user's password 
// using the generated salt, using two arguements.

.then(hashedPassword => {
    console.log(`Password hash: ${hashedPassword}`);

    return User.create ({

        username,
        email, 
        passwordHash:hashedPassword // here we get the hashedPW!
    })
})
.then (userFromDb => {

    console.log('Newly created user is: ', userFromDb)
    res.redirect('/userProfile');
})

.catch (error => next (error));
});

//userprofile render
router.get('/userProfile', (req, res) => res.render('users/user-profile'));
//how can I put the username (personalized)??

module.exports = router;
