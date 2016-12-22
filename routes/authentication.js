var mongoose = require('mongoose'),
    express  = require('express'),
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



module.exports = router;
