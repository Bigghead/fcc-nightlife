var mongoose = require('mongoose'),
    express = require('express'),
    Yelp    = require('yelp'),
    yelpData = require('../models/yelpSchema.js'),
    User     = require('../models/userSchema.js'),
    router  = express.Router();
    

router.post('/bars/:city/:barID', isLoggedIn, function(req, res){
  yelpData.findOne( { yelpID : req.params.barID} )
          .then( ( err, foundYelp ) => {
            if( err ) return Promise.reject( { error: 'No Data Found' } )
            if( !foundYelp ){
              return yelpData.create( {
                yelpID: req.params.barID,
                going: req.user._id
              } )
              .then( ( err, savedYelp ) => {
                if( err ) {
                  console.log(err);
                } else {
                  res.sendStatus(200);
                }
                } )
            } else {
              foundYelp.going.push( req.user._id );
              foundYelp.save();
              res.sendStatus(200);
            }
          } )
          .catch( err => res.status(400).send( { error: 'Can not add user' } ) )
}) ;


router.delete('/bars/:city/:barID', isLoggedIn, ( req, res ) => {
  yelpData.findOne( { yelpID : req.params.barID } )
          .then( ( err, foundYelp ) => {
            if( err ) return Promise.reject( { error: 'No Data Found' } );
            foundYelp.going.splice( (foundYelp.going.indexOf(req.user._id) ), 1 );
            foundYelp.save();
            res.redirect('/bars/' + req.params.city);
          } )
          .catch( err => res.status( 400 ).send( { error: 'Can not delete user' } ) );
} )


function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/');
  }
}

module.exports = router;
