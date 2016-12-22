require('dotenv').config();

var mongoose = require('mongoose'),
    express = require('express'),
    Yelp    = require('yelp'),
    yelpData = require('../models/yelpSchema.js'),
    router  = express.Router();

var yelp = new Yelp({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    token: process.env.token,
    token_secret: process.env.token_secret,
});

var googleKey = process.env.googleKey;




router.get('/', function(req, res){
  res.render('landing');
});


router.post('/home', function(req, res){
  var cityName = req.body.cityName;
  yelp.search({
    term: 'bar',
    location: cityName
  }, function(err, data){
    if(err){
      console.log(err);
    } else {
      data.businesses.forEach(function(eachYelp){
        yelpData.create({
          name: eachYelp.name,
          yelpID: eachYelp.id
        }, function(err, savedData){
          if(err){
            console.log(err);
          } else {

          }
        });
      });
      //console.log(data);
        res.render('googleMap', {data : data, googleKey : googleKey});
    }
  });
});



module.exports = router;
