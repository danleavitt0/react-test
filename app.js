    var express  = require('express');
    var app = express();                               // create our app w/ express
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var request = require('request');
    var fs = require('fs');

    // configuration =================

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    app.post('*', function(req,res){
      fs.readFile('./public/comments.json', function(err, data) {
        console.log(data);
        var comments = JSON.parse(data);
        comments.push(req.body);
        fs.writeFile('./public/comments.json', JSON.stringify(comments, null, 4), function(err) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-cache');
          res.send(JSON.stringify(comments));
        });
      });
    });

    app.get('*', function(req, res) {
      res.sendfile('./' + req.url);
    });


    // listen (start app with node server.js) ======================================
    app.listen(process.env.PORT || 3000);