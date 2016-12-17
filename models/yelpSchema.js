var mongoose = require('mongoose');


var yelpSchema = new mongoose.Schema({
  name : String,
  yelpID: String,
  going:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

var yelpData = mongoose.model('yelpdata', yelpSchema);

module.exports = yelpData;
