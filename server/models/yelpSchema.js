var mongoose = require('mongoose');


var yelpSchema = new mongoose.Schema({
  yelpID: String,
  going : [
  ]
});

var yelpData = mongoose.model('Yelpdata', yelpSchema);

module.exports = yelpData;
