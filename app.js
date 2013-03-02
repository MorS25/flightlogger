
/**
 * Module dependencies.
 */

var express = require('express')
  , jsdom = require('jsdom')
  , request = require('request')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , format = require('util').format
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({uploadDir:'./upload'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/home', routes.home);
app.get('/about', routes.about);
app.get('/upload', routes.upload);

app.post('/upload', function(req, res, next){
  // the uploaded file can be found as `req.files.image` and the
  // title field as `req.body.title`
  res.send(format('\nuploaded %s (%d Kb) to %s as %s'
    , req.files.flightlog.name
    , req.files.flightlog.size / 1024 | 0 
    , req.files.flightlog.path
    , req.body.title));
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
