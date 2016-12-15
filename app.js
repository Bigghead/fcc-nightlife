var express    = require('express'),
      mongoose   = require('mongoose'),
      bodyParser = require('body-parser'),
      app        = express();


//DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/nightlife');

//Setup
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('landing');
});


app.listen('8000', function(){
  console.log('Night Life App Starting!');
});
