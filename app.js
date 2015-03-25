    var express = require('express');
    var app = express();
    var server = require('http').createServer(app);
    var io = require('socket.io')(server);
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var request = require('request');
    var fs = require('fs');
    var _ = require('lodash')

    // configuration =================

    app.use(express.static(__dirname + '/lib'));
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({'extended':'true'}));            
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
    app.use(methodOverride());

    app.get('/comments.json', function(req,res){
      res.sendfile('./lib/' + req.url);
    });

    app.get('/posts.json', function(req,res){
      res.sendfile('./lib/' + req.url);
    });

    app.get('*', function(req, res) {
      res.sendfile('./' + req.url);
    });

    // listen (start app with node server.js) ======================================
    app.set('port', process.env.PORT || 5000);

    io.on('connection', function(socket){

      socket.on('new comment', function(comment, id){
        fs.readFile('./lib/posts.json', function(err, data) {
          var posts = JSON.parse(data);
          var idx = _.findIndex(posts, function(post){
            return post.id === id;
          })
          posts[idx].comments.push(comment);
          fs.writeFile('./lib/posts.json', JSON.stringify(comments, null, 4), function(err) {
            io.emit('added comment', comments);
          });
        });
      })

      socket.on('remove comment', function(idx){
        fs.readFile('./lib/posts.json', function(err, data) {
          var comments = JSON.parse(data);
          _.pullAt(comments, idx);
          fs.writeFile('./lib/posts.json', JSON.stringify(comments, null, 4), function(err) {
            io.emit('added comment', comments);
          });
        });
      });

      socket.on('add like', function(idx){
        fs.readFile('./lib/posts.json', function(err, data) {
          var comments = JSON.parse(data);
          if(comments[idx].likes)
            comments[idx].likes++;
          else
            comments[idx].likes = 1;
          fs.writeFile('./lib/posts.json', JSON.stringify(comments, null, 4), function(err) {
            io.emit('added comment', comments);
          });
        });
      })

      socket.on('disconnect', function(){
        console.log('user disconnected');
      });

    })

    server.listen(app.get('port'));