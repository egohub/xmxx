var express = require('express'),
    bodyParser      = require('body-parser'),
    request = require('sync-request')
   app = express();
   app.use(express.static(__dirname + '/public'));

//   api        = require('./routes')

//app.get('/posts', api.posts);
//app.get('/posts/:id', api.post);



app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});