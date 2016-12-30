var mongoose = require('mongoose'),
    express = require('express'),
    Yelp    = require('yelp'),
    yelpData = require('../models/yelpSchema.js'),
    User     = require('../models/userSchema.js'),
    router  = express.Router();

router.get('/bars/user/:city/:barID', function(req, res){
  yelpData.create({
    yelpID: req.params.barID,
    going : req.user._id
  }, function(err, savedYelp){
    if(err){
      console.log(err);
    } else {
      res.redirect('/bars/' + req.params.city);
    }
  });
});

module.exports = router;
