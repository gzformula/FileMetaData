var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

router.route('/')
.post(parseUrlencoded, function(request, response){  
    var url = request.body.url;
    console.log("Redirect post to:", url);
    response.redirect('/api/' + url);
});

module.exports = router;