/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var resource = require('express-resource');
var app = express();
var config= require('./config/config')();
var mongo = require('./db/mongo-store');

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', function(req, res, next){
res.render('home', { title: 'home page' });
});

app.resource('users', require('./routes/user.js'));
app.resource('stores', require('./routes/store.js'));
app.resource('products', require('./routes/product.js'));
app.resource('deals', require('./routes/deal.js'));
var port = Number(process.env.PORT || config.port);
http.createServer(app).listen(port , function(){
  console.log('Express server listening on port ' + port );
});

