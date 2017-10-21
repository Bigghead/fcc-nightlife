var mongoose = require('mongoose'),
    express = require('express'),
    Yelp    = require('yelp'),
    yelpData = require('../models/yelpSchema.js'),
    User     = require('../models/userSchema.js'),
    router  = express.Router();

router.post('/bars/user/:city/:barID', isLoggedIn, function(req, res){
  yelpData.findOne({yelpID : req.params.barID}, function(err, foundYelp){
    if(foundYelp === null){
      yelpData.create({
        yelpID: req.params.barID,
        going: req.user._id
      }, function(err, savedYelp){
        if(err){
          console.log(err);
        } else {
          res.redirect('/bars/' + req.params.city);
        }
      });
    } else {
      console.log(foundYelp);
      console.log(req.user);
      foundYelp.going.push(req.user._id);
      foundYelp.save();
      console.log(foundYelp);
      res.redirect('/bars/' + req.params.city);

    }
  });
});


router.delete('/bars/user/:city/:barID', isLoggedIn, function(req, res){
  yelpData.findOne({yelpID : req.params.barID}, function(err, foundYelp){
    if(err){
    console.log(err);
  } else {
    console.log(foundYelp.going);
    console.log(req.user._id);
    foundYelp.going.splice((foundYelp.going.indexOf(req.user._id)), 1);
    foundYelp.save();
    console.log(foundYelp);
    res.redirect('/bars/' + req.params.city);
  }
});
  //res.send('Delete');
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/bars/user/login');
  }
}

module.exports = router;