require('dotenv').config();

var mongoose = require('mongoose'),
    express = require('express'),
    Yelp    = require('yelp'),
    yelpData = require('../models/yelpSchema.js'),
    Async    = require('async'),
    router  = express.Router();

var yelp = new Yelp({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    token: process.env.token,
    token_secret: process.env.token_secret,
});

var googleKey = process.env.googleKey;


router.get('/', function(req, res){
  res.redirect('/bars');
});

router.get('/bars', function(req, res){
  res.render('landing');
});


router.post('/bars', function(req, res){
  var cityName = req.body.cityName;

    //console.log(data);
    res.redirect('/bars/'+ cityName);
      //res.render('googleMap', {data : data, googleKey : googleKey});
});

router.get('/bars/:city', function(req, res){
  var cityName = req.params.city;
  yelp.search({
    term: 'bar',
    location: cityName
  }, function(err, data){
    if(err){
      console.log(err);
    } else {
      //loop through each yelp result, and check if we have
      //that in the database

      Async.each(data.businesses,
            function(item, callback){
              yelpData.findOne({yelpID: item.id}, function(err, foundYelp){
                if(err){
                  console.log(err);
                } else {
                  if(foundYelp === null){
                    item.whosGoing = [];
                  } else {
                    console.log(foundYelp);
                    item.whosGoing = foundYelp.going;
                    console.log('Run');
                  }
                }
              });
              callback();
            },
          function(){
            console.log('Running');
          });
      console.log('hello');


      res.render('googleMap', {data : data, googleKey : googleKey});

    }
  });
});



module.exports = router;
