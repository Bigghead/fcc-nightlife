if (process.env.NODE_ENV !== 'production') {
require('dotenv').config()
}
var mongoose = require('mongoose'),
    express = require('express'),
    Yelp    = require('yelp'),
    yelpData = require('../models/yelpSchema.js'),
    router  = express.Router();

var yelp = new Yelp({
    consumer_key: process.env.consumer_key || consumer_key,
    consumer_secret: process.env.consumer_secret || consumer_secret,
    token : process.env.token || token,
    token_secret: process.env.token_secret || token_secret,
});

var googleKey = process.env.googleKey || googleKey;


router.get('/', function(req, res){
  res.redirect('/bars');
});

router.get('/bars', function(req, res){
  res.render('landing');
});


router.post('/bars', function(req, res){
  var cityName = req.body.cityName;
  res.cookie('cityName', cityName);
    res.redirect('/bars/'+ cityName);
});

router.get('/bars/:city', function(req, res){
  console.log(req.cookies);
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
          //console.log(bars);
          if(bars.length !== 0){
            bars.forEach(function(bar){
              for(var i = 0 ; i <= 10 ; i ++){
                if(!data.businesses[i].whosGoing){
                  data.businesses[i].whosGoing = [];
                } else if(bar.yelpID === data.businesses[i].id){
                  data.businesses[i] = bar.going;
                 }
              }
            });
          } else {
            data.businesses.forEach(function(business){
              business.whosGoing = [];
            });
          }
        }
        res.render('googleMap', {data : data, bars: bars, googleKey : googleKey, cityName: cityName});

      });
    }
  });
});




module.exports = router;
