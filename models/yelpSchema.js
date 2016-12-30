var mongoose = require('mongoose');


var yelpSchema = new mongoose.Schema({
  yelpID: String,
  going : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

var yelpData = mongoose.model('Yelpdata', yelpSchema);

module.exports = yelpData;
