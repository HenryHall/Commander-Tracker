
var path = require('path');

module.exports = function(router){
    router.get('/', function(req, res){
      console.log(`Joining game: ${req.query.gameID}`);
      res.sendFile( path.resolve( './public/overlay/overlay.html' ) );
    });

    return router;
}
