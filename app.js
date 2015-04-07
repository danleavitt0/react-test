    var express = require('express');
    var app = express();
    var server = require('http').createServer(app);
    var io = require('socket.io')(server);
    var mongoose = require('mongoose');
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var request = require('request');
    var fs = require('fs');
    var _ = require('lodash');

    mongoose.connect('mongodb://localhost/test');
    var db = mongoose.connection;
    var Schema = mongoose.Schema;

    var postSchema = new Schema({
      title:  String,
      author: String,
      body:   String,
      comments: [{ author:String, body: String, date: Date }],
      date: { type: Date, default: Date.now },
      hidden: Boolean,
      meta: {
        likes: Number
      }
    });

    var Posts = mongoose.model('Post', postSchema);


    console.log('Starting Up');

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
      Posts.find(function(err, posts){
        console.log(posts);
      });
      res.sendfile('./lib/' + req.url);
    });

    app.get('*', function(req, res) {
      res.sendfile('./' + req.url);
    });

    // listen (start app with node server.js) ======================================
    app.set('port', process.env.PORT || 3000);

    io.on('connection', function(socket){
      socket.on('connect', function(){
        console.log('connected');
      })

      socket.on('new comment', function(comment){
        var post = new Posts ({
          author:comment.author,
          body:comment.text
        });
        console.log(post);
        post.save();
        Posts.find(function(err,posts){
          console.log(posts);
        })
      })

      socket.on('remove comment', function(i,id){
        fs.readFile('./lib/posts.json', function(err, data) {
          var posts = JSON.parse(data);
          var idx = _.findIndex(posts, function(post){
            return post._id === id;
          });
          _.pullAt(posts[idx].comments, i);
          fs.writeFile('./lib/posts.json', JSON.stringify(posts, null, 4), function(err) {
            io.emit('added comment', posts[idx].comments, id);
          });
        });
      });

      socket.on('add like', function(idx){
        fs.readFile('./lib/posts.json', function(err, data) {
          var posts = JSON.parse(data);
          var comments 
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