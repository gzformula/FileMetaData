'use strict';

var express = require('express');
var mongo = require('mongodb').MongoClient;
var app = express();
var mongoUrl = process.env.MONGO_URI || 'mongodb://gzformula:Cruentis33@ds017582.mlab.com:17582/heroku_0fbfpzr8';
var assert = require('assert');
var port = process.env.PORT || 8080;

app.use(express.static('public'));

// connect to the MongoDB database
mongo.connect(mongoUrl, function(err, db) {
    assert.equal(null, err);
    console.log("Successfully connected to MongoDB: ", mongoUrl);

    // homepage
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });
    
    // require route modules
    var parseRouter = require('./routes/bodyparseroute');
    var searchUrl = require('./routes/imagesearch');
    var latestUrl = require('./routes/latestsearch');
    
    // all requests are dispatched to the routers
    app.use('/api', parseRouter);
    searchUrl(app, db);
    latestUrl(app, db);
    
    
    // listen for client connections
    app.listen(port, function() {
        console.log('Express server listening on port', port);
    });

});
