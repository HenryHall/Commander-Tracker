
console.log("Hello from server.js");

var express = require('express');
var router = express.Router()
var path = require('path');
var app = express();


app.use( express.static('public') );
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('Server up:', app.get('port'));
});


app.get( '/', function( req, res ){
  console.log( 'Serving Home' );
  res.sendFile( path.resolve( 'public/index.html' ) );
});


var joinGameRoute = require ('../server/modules/joinGame.js')(router);
app.use('/joinGame', joinGameRoute);
