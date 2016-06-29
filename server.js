'use strict';

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var multer  = require('multer');
var upload = multer().single('file');

app.use(express.static('public'));

    // homepage
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });
    

 
app.post('/getfilesize', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading 
      console.log(err);
      return;
    }
    // Everything went fine 
    var filesize = req.file.size;

    res.send(JSON.stringify({ size: filesize }));
  });
});
    
    // listen for client connections
    app.listen(port, function() {
        console.log('Express server listening on port', port);
    });
