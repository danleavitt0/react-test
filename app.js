    var express  = require('express');
    var http = require('http');
    var app = express();                              
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var request = require('request');
    var fs = require('fs');

    // configuration =================

    app.use(express.static(__dirname + '/lib'));
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({'extended':'true'}));            
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
    app.use(methodOverride());

    app.post('*', function(req,res){
      fs.readFile('./lib/' + req.url, function(err, data) {
        var comments = JSON.parse(data);
        comments.push(req.body);
        fs.writeFile('./lib' + req.url, JSON.stringify(comments, null, 4), function(err) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-cache');
          res.send(JSON.stringify(comments));
        });
      });
    });

    app.get('/comments.json', function(req,res){
      res.sendfile('./lib/' + req.url);
    });

    app.get('*', function(req, res) {
      res.sendfile('./' + req.url);
    });


    // listen (start app with node server.js) ======================================
    app.set('port', process.env.PORT || 5000);


    http.createServer(app).listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
      process.send && process.send('listening');
    });