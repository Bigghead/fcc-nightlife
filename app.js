require('dotenv').config();

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

var googleKey = process.env.googleKey;

//SCHEMAS
var User = require('./models/userSchema.js');
var yelpData = require('./models/yelpSchema.js');
//DB
mongoose.Promise = global.Promise;
mongoose.connect(process.env.mongoURL);


//=====YELP====



//========ROUTE IMPORTS======
var indexRoute = require('./routes/bars.js');
var userAuthentication = require('./routes/authentication.js');


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


//=======TELL EXPRESS TO USE ROUTES=====
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});
app.use(indexRoute);
app.use(userAuthentication);


//======PASSPORT=====
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.listen('8000', function(){
  console.log('Night Life App Starting!');
});
