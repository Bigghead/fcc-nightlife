var mongoose = require('mongoose'),
    express  = require('express'),
    passport = require('passport'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User     = require('../models/userSchema.js'),
    router   = express.Router();


router.get('/bars/register', function(req, res){
  res.render('registerForm');
});


//======USER REGISTRATION======
router.post('/bars/register', function(req, res){

  //SANITIZE??
  var username = req.body.username;
  var password = req.body.password;

  User.register(new User({username: username}),
  password,
  function(err, registeredUser){
    if(err){
      console.log(err);
      res.render('registerForm');
    } else {
      passport.authenticate('local')(req, res, function(){
        res.redirect('/');
      });
    }
  });
});


//==========LOGIN=======
router.get('/bars/login', function(req, res){
  res.render('loginForm');
});

router.post('/bars/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/bars/login'
}));


//=====LOGOUT====
router.get('/bars/logout', function(req, res){
  req.logout();
  res.redirect('/');
})



module.exports = router;
