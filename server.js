var express = require('express'),
    bodyParser      = require('body-parser'),
    request = require('sync-request'),
    cheerio = require('cheerio'),
    mongoose = require("mongoose"),
   app = express();
   app.use(express.static(__dirname + '/www'));
    
   app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
  });
var Posts = require('./models/posts');
var MONGODB_URL  = process.env.MONGODB_URL;
var Killer = process.env.KILLER;

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URL);
var db = mongoose.connection;

db.on("error", function (error) {
    console.log("Mongoose Error: ", error);
});
db.once("open", function () {
    console.log("Mongoose connection successful.");
});

app.get('/posts', function(req, res) {
    var data = [];
    var req = request('GET', 'https://channelmyanmar.org/wp-json/wp/v2/posts').getBody('utf8');
    var json = JSON.parse(req)
    json.forEach(function(ele) {
    //https://channelmyanmar.org/wp-json/wp/v2/media?parent=
    var img = request('GET', 'https://channelmyanmar.org/wp-json/wp/v2/media?parent='+ele.id).getBody('utf8');
    var  pic = JSON.parse(img) ;

      data.push({
        id : ele.id,
        title : ele.title.rendered,
        content: ele.excerpt.rendered,
        image:pic[0], 
        selfLink : 'https://xmxx.herokuapp.com/posts/'+ele.id
      })
      console.log(img);
    });
       res.send(data)

})
app.get('/posts/:link', (req, res) => {
    var urlss = req.params.link;

    var get =  request('GET','https://channelmyanmar.org/?p='+urlss).getBody('utf8');
    var $= cheerio.load(get);
    var init = $('.elemento a');
    var link = [];
    var post = {};
          post.postId = urlss;
          post.postTitle= $('title').text();
          post.postImage= $('.fix img').attr('src')
    
    init.each(function(){
      var urls = $(this).prop('href');
      if (urls.length > 3) {
          var res = request('GET', Killer+urls);
          link.push(res.getBody('utf8'))
          post.link = link
      }
    })
    
    Posts.findOrCreate(post,{ appendToArray: true }, (err, result) => {
      console.log(result);
      res.send(result)
    })
})
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
