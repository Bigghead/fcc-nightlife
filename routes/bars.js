require('dotenv').config();

var mongoose = require('mongoose'),
    express = require('express'),
    Yelp    = require('yelp'),
    yelpData = require('../models/yelpSchema.js'),
    Async    = require('async'),
    forEach = require('async-foreach').forEach,
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

      yelpData.find({}, function(err, bars){
        if(err){
          console.log(err);
        } else {
          console.log(bars);
          bars.forEach(function(bar){
            data.businesses.forEach(function(business){
              if(bar.yelpID === business.id){
                console.log(business.name + business.rating);
                business.whosGoing = bar.going;
              } else{
                business.whosGoing = [];
              }
            });
          });
        }
        //console.log(data.businesses);
        res.render('googleMap', {data : data, googleKey : googleKey});

      });
      //res.render('googleMap', {data : data, googleKey : googleKey});

    }
  });
});



module.exports = router;
