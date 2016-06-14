'use strict';

var express = require('express');
var mongo = require('mongodb').MongoClient;
var url = require('url');
var app = express();

mongo.connect(process.env.MONGO_URI);
var collectionName = 'urls';

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

app.get("/index", function(request, response) {
        if (root == '' || root == 'index.html') {
        response.writeHead(301, {
          Location: (request.socket.encrypted ? 'https://' : 'http://') +
          request.headers.host + '/index.html'}
    );
    response.end();
    return;
    }
});

app.get("/new/*", function(request, response) {
    var arg2 = request.params[0];

    console.log("arg2", arg2);
  // insertURL(originalURL, shortenedURL);
  console.log("Valid URL:", validateURL(arg2));
  if (validateURL(arg2)) {
  	
  } else {
  	 response.send(JSON.stringify({ error: "Invalid URL" }));
  }
     
   response.end();
});

function insertURL(original, shortened) {
    mongo.connect(process.env.MONGO_URI, function(err, db) {
      if (err) throw err;
      var docs = db.collection(collectionName);
      var jsonDoc =  JSON.stringify({ original: original, shortened: shortened });
      console.log(jsonDoc);
    docs.insert({
      jsonDoc
    }, function(err, data) {
      // handle error
      if (err) throw err;
      // other operations
        db.close();
    });
    });
}


function validateURL(url) {
	var myRegExp = new RegExp(
	 "/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i");

    var urlregex = new RegExp(
    "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
    return urlregex.test(url);
}