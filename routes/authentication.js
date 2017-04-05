var mongoose = require('mongoose'),
  express = require('express'),
  passport = require('passport'),
  passportLocalMongoose = require('passport-local-mongoose'),
  User = require('../models/userSchema.js'),
  expressSanitizer = require('express-sanitizer'),
  router = express.Router();


router.get('/bars/user/register', function (req, res) {
  res.render('registerForm');
});


//======USER REGISTRATION======
router.post('/bars/user/register', function (req, res) {

  //SANITIZE??
  var username = req.sanitize(req.body.username);
  var password = req.sanitize(req.body.password);

  User.register(new User({ username: username }),
    password,
    function (err, registeredUser) {
      if (err) {
        console.log(err);
        res.render('registerForm');
      } else {
        passport.authenticate('local')(req, res, function () {
          res.redirect('/');
        });
      }
    });
});


//==========LOGIN=======
router.get('/bars/user/login', function (req, res) {
  res.render('loginForm');
});


router.post('/bars/user/login',
  passport.authenticate('local'),
  function (req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    if (req.cookies.cityName) {
      res.redirect('/bars/' + req.cookies.cityName);
    }
    res.redirect('/');
  });


//=======github Auth Routes =======
router.get('/auth', passport.authenticate('github'));
router.get('/auth/error', function (req, res) {
  res.redirect('/bars/user/register');
});
router.get('/auth/callback',
  passport.authenticate('github', { failureRedirect: '/auth/error' }),
  function (req, res) {
    if (req.cookies.cityName) {
      res.redirect('/bars/' + req.cookies.cityName);
    }
    res.redirect('/bars/');
  }
);


//=======Google Auth Routes======
router.get('/auth/google', passport.authenticate('google'));

router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/bars/user/login'
  }),
  function (req, res) {
    if (req.cookies.cityName) {
      res.redirect('/bars/' + req.cookies.cityName);
    }
    res.redirect('/bars/');
  }
);

//=====LOGOUT====
router.get('/bars/user/logout', function (req, res) {
  req.logout();
  res.redirect('/bars');
})



module.exports = router;
