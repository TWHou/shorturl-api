var express = require("express");
var app = express();
var path = require("path");
var func = require("./functions.js");

var mongo = require('mongodb').MongoClient;
var url = 'mongodb://freecodecamp:fccpass@ds019826.mlab.com:19826/short-url';

mongo.connect(url, function(err, db){
  if (err) {
    console.log("Unable to connect to the mongoDB server. Error:", err);
  } else {
    var coll = db.collection('url');
    
    app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname+'/index.html'));
    });
    
    app.get('/:string', function (req, res) {
      if(req.params.string != "favicon.ico") {
        var short_url = req.params.string;
        func.fetch(short_url, coll, res);
      }
    });

    app.get('/new/:string*', function (req, res) {
      var orig = req.url.slice(5);
      func.save(orig, coll, res);
    });

    app.listen(process.env.PORT || 8080, function () {
      console.log('Node.js listening on port ' + process.env.PORT);
    });

  }
});


