var assert = require('assert');

module.exports = function(app, db) {
    // add url via dynamic route
    app.get('/new/*', function(request, response){
        var url = request.params[0];
        var httpProto = request.headers["x-forwarded-proto"];
        var myDomain = request.headers.host;
        if (!validateURL(url)) {
            response.status(404).json({ error: "new URL invalid"});
        }
        else { 
            // check if url is in the database
            db.collection('urls').find({ "original": url }).toArray(function(err, docs) {
                    assert.equal(err, null);
                    // if not add the url to the database with a short url
                    if (docs.length == 0) {
                        // count the number of entries to add the next short url
                        db.collection('urls').find().count(function(err, count) {
                            assert.equal(err, null);
                            var shortNum = count+1;
                            // add the new url to the database and respond
                            db.collection('urls').insert({ "original": url, "_id": shortNum });
                            response.json({ original_url: url, short_url: httpProto + "://" + myDomain + "/" + shortNum });
                        });
                    } 
                    // if it is in the database then respond with the result
                    else {
                        response.json({ original_url: docs[0].original, short_url: httpProto + "://" + myDomain + "/" + docs[0]._id });
                    }
                    
                });
        }
    });
};

function validateURL(url) {
    var urlregex = new RegExp(
    "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
    return urlregex.test(url);
}

