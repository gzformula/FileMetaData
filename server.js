'use strict';

var express = require('express');
var mongo = require('mongodb').MongoClient;
var app = express();
var mongoUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/shrinkurls';
var assert = require('assert');
var port = process.env.PORT || 8080;

app.use(express.static('public'));

// connect to the MongoDB database
mongo.connect(mongoUrl, function(err, db) {
    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    // homepage
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });
    
    // require route modules
    var parseRouter = require('./routes/bodyparseroute');
    var newUrl = require('./routes/new');
    var forwardUrl = require('./routes/forward');
    
    // all requests are dispatched to the routers
    app.use('/new_form', parseRouter);
    newUrl(app, db);
    forwardUrl(app, db);
    
    
    // listen for client connections
    app.listen(port, function() {
        console.log('Express server listening on port', port);
    });

});
