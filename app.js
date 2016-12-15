var express      = require('express'),
      mongoose   = require('mongoose'),
      bodyParser = require('body-parser'),
      cors       = require('cors'),
      Yelp       = require('yelp'),
      app        = express();


//DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/nightlife');


//Setup
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  console.log(res);
  next();
});


app.get('/', function(req, res){
  res.render('landing');
});

app.get('/home', function(req, res){
  res.render('homepage');
});

app.post('/home', function(req, res){
  var city = req.body.cityName;
  console.log(req);
  res.render('homepage', {city : city});
});


app.listen('8000', function(){
  console.log('Night Life App Starting!');
});
