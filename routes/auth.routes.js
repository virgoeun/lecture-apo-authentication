const { Router } = require("express");
const router = new Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");
const mongoose = require("mongoose"); // for validation
// Since this validation is part of mongoose,
// we will have to use mongoose to retrieve the message. (render the view(msg) to the user)

// GET route ==> to display the signup form to users
router.get("/signup", (req, res) => res.render("auth/signup"));

// POST route ==> to process form data
router.post("/signup", (req, res, next) => {
  console.log("The form data: ", req.body);

  const { username, email, password } = req.body;

  //required request (validation)
  if (!username || !email || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render("auth/signup", {
        errorMessage:
          "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    // once the salt is generated successfully, the code inside the .then block will execute.
    // The salt variable inside the block holds the generated salt value.
    // .hash(password, salt) => a function call that hashes the user's password
    // using the generated salt, using two arguements.

    .then((hashedPassword) => {
      console.log(`Password hash: ${hashedPassword}`);

      return User.create({
        username,
        email,
        passwordHash: hashedPassword, // here we get the hashedPW!
      });
    })
    .then((userFromDb) => {
      console.log("Newly created user is: ", userFromDb);
      res.redirect("/userProfile");
    })

    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        //form
        res.status(500).render("auth/signup", { errorMessage: error.message }); //500 (Internal Server Error)
      } else if (error.code === 11000) {
        //ducplicate key error: Mongo DB error

        console.log(
          " Username and email need to be unique. Either username or email is already used. "
        );

        res.status(500).render("auth/signup", {
          errorMessage: "User not found and/or incorrect password.",
        });
      } else {
        next(error);
      }
    });
});

//userprofile render
//router.get('/userProfile', (req, res) => res.render('users/user-profile'));
//how can I put the username (personalized)??

router.get("/userProfile", (req, res) => {
  res.render("users/user-profile", { userInSession: req.session.currentUser });
});

//login get
router.get("/login", (req, res) => res.render("auth/login"));

// POST login route ==> to process form data
router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email }) // <== check if there's user with the provided email
    .then((user) => {
      // <== response from DB - doesn't matter if found or not)
      if (!user) {
        // <== "user" here is just a placeholder and represents the response from the DB
        //it can be user object or null whether there is a user
        console.log("Email not registered. ");
        res.render("auth/login", {
          errorMessage: "User not found and/or incorrect password.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/userProfile");

        // when we introduce session, the following line gets replaced with the above;
        //res.render('users/user-profile', { user });
        //if the two passwords match, render the user-profile.hbs
        // and pass the user object to this view
      } else {
        // if the two passwords DON'T match, render the login form again
        // and send the error message to the user
        console.log("Incorrect password. ");
        res.render("auth/login", {
          errorMessage: "User not found and/or incorrect password.",
        });
      }
    })
    .catch((error) => next(error));
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
