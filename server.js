var express = require('express'),
    bodyParser      = require('body-parser'),
    request = require('sync-request'),
    cheerio = require('cheerio'),
   app = express();
   app.use(express.static(__dirname + '/public'));
    
   app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
  });
//   api        = require('./routes')

//app.get('/posts', api.posts);
//app.get('/posts/:id', api.post);

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
        var data = [];
        
  init.each(function(){
  var urls = $(this).attr('href');
    var links = {link:$(this).attr('href')}
    var res = request('GET', 'https://killer.suchcrypto.co/kill?'+urls);
    console.log(urls)
     data.push(res.getBody('utf8'))
     // data.push(links)
         // res.send(links)

  })
    res.send(data)
})
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
