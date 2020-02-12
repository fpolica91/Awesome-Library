// routes/auth.routes.js
const { Router } = require("express");
const router = new Router();
const passport = require("passport");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
// I REQUIRED USER MODEL TO CREATE USER IN DATABSE
const User = require("../models/User.model");
const ensureLogin = require("connect-ensure-login");

// auth.routes.js
// .get() route ==> to display the signup form to users
router.get("/signup", (req, res) => res.render("auth/signup"));

// .post() route ==> to process form data
router.post("/signup", async (req, res, next) => {
  // 1. we get  the values from the body
  // 2. we hash the password
  // 3. we created the user with the properties from req.body + hashed password,
  // 4. we display the created user to the client

  // we are getting these properties from the inputs
  const { username, email, password } = req.body;
  // we are hashing the password so we can get T$QWYQ$EYSEHTWUTUQ^U$]

  const hashPass = await bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt));

  // we  are creating the user  in the db
  const user = await User.create({
    username,
    email,
    // we  are  inserting the hashed passwordm into  the password property
    password: hashPass
  });

  return res.json(user);

  // User.create({
  //   username,
  //   email,
  //   password
  // }).then(user => {
  //   res.json(user);
  // });

  // bcryptjs
  //   .genSalt(saltRounds)
  //   .then(salt => bcryptjs.hash(password, salt))
  //   .then(hashedPassword => {
  //     console.log(`Password hash: ${hashedPassword}`);
  //   })
  //   .catch(error => next(error));

  // .post() route ==> to process form data
  // router.post('/signup', (req, res, next) => {
  //   console.log('The form data: ', req.body);
  // });
});

// .get() route for login
router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});
// .post() route for login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
