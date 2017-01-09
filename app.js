if (process.env.NODE_ENV !== 'production') {
require('dotenv').config()
}
var express      = require('express'),
      mongoose   = require('mongoose'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      cors       = require('cors'),
      Yelp       = require('yelp'),
      passport   = require('passport'),
      localStrategy = require('passport-local'),
      githubStrategy = require('passport-github').Strategy,
      googleStrategy = require('passport-google-oauth').OAuth2Strategy,
      passportLocalMongoose = require('passport-local-mongoose'),
      Session    = require('express-session'),
      Method     = require('method-override'),
      app        = express();


var googleKey = process.env.googleKey || googleKey,
    googleClient = process.env.googleClient || googleClient,
    googleSecret = process.env.googleSecret || googleSecret,
    gitClient = process.env.gitClient || gitClient,
    gitSecret = process.env.gitSecret || gitSecret;



//SCHEMAS
var User = require('./models/userSchema.js');
var yelpData = require('./models/yelpSchema.js');
//DB
mongoose.Promise = global.Promise;
mongoose.connect(url);


//=====YELP====



//========ROUTE IMPORTS======
var indexRoute = require('./routes/bars.js');
var userAuth = require('./routes/authentication.js');
var userAction = require('./routes/userRoute.js');



//Setup
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");

  next();
});

app.use(Method('_method'));
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
app.use(userAuth);
app.use(userAction);


//======PASSPORT=====
passport.use(new localStrategy(User.authenticate()));

//========github passport
passport.use(new githubStrategy({
    clientID: gitClient,
    clientSecret: gitSecret,
    callbackURL: "http://localhost:8000/auth/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOne({username: profile.username}, function(err, foundUser){
      if(err){
        console.log(err);
      } else if(foundUser === null){
        User.create({username : profile.username}, function(err, madeUser){
          if(err){
            console.log(err);
          } else {
            return cb(err, madeUser);
          }
        });
      } else {
        return cb(err, foundUser);
      }
    });
  }
));


//=====google passport======
passport.use(new googleStrategy({
  clientID : googleClient,
  clientSecret : googleSecret,
  scope : 'profile',
  callbackURL: "http://localhost:8000/auth/google/callback"
}, function(acccessToken, refreshToken, profile, done){
  User.findOne({username: profile.displayName}, function(err, foundUser){
    if(err){
      console.log(err);
    } else if(foundUser === null){
      User.create({username : profile.displayName}, function(err, madeUser){
        if(err){
          console.log(err);
        } else {
          return done(err, madeUser);
        }
      });
    } else {
      return done(err, foundUser);
    }
  });
 }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.listen('8000', function(){
  console.log('Night Life App Starting!');
});
