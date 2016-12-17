var express      = require('express'),
      mongoose   = require('mongoose'),
      bodyParser = require('body-parser'),
      cors       = require('cors'),
      Yelp       = require('yelp'),
      passport   = require('passport'),
      localStrategy = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      Session    = require('express-session'),
      app        = express();

//SCHEMAS
var User = require('./models/userSchema.js');
var yelpData = require('./models/yelpSchema.js');
//DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/nightlife');

//=====YELP====
var yelp = new Yelp({
  consumer_key: 'sfgPlJGSBNW5aBQIDC5i4Q',
  consumer_secret: 'SqxCS3NS4Kc1odi3w27Er3poObQ',
  token: 'AoHJqZ5z7z2s0py6SbABlazi62xV9Isg',
  token_secret: 'o8U5q3AWEIf8MXTS-6O_uWPmgH8',
});

//Setup
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");

  next();
});
app.use(Session({
  secret:'Hello from the other side',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


//======PASSPORT=====
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/', function(req, res){
  res.render('landing');
});


app.post('/home', function(req, res){
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
        res.render('homepage', {data : data});
    }
  });

});


app.listen('8000', function(){
  console.log('Night Life App Starting!');
});
