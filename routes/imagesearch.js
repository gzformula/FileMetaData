var assert = require('assert');
var googleImages = require('google-images');

var client = googleImages('015830139442214026773:zsepbbe1458', 'AIzaSyD9DY03q_WCfRuIRjcvWGbGqq3D42-WunY');

module.exports = function(app, db) {
    // add url via dynamic route
    app.get('/api/imagesearch/*', function(request, response){
        var pageNum = request.query['offset'];
        var searchString = request.params[0];
        console.log("searchString:", searchString);
        console.log("pageNum:", pageNum);
        
        if (typeof(searchString) == undefined) {
            response.status(404).json({ error: "invalid search request"});
        } else { 
             if (typeof(pageNum) == undefined) {
            client.search(searchString)
                .then(function (images) {
                    response.json(images);
                     
                });
             } else {
                    // paginate results
                    client.search(searchString, {
                        page: pageNum
                    })
                    .then(function(images) {
                         response.json(images);
                    });
                }

            // add search to the latest db docs
            db.collection('imagesearch').find({ "requested": searchString }).toArray(function(err, docs) {
                    assert.equal(err, null);
                    // if not add the url to the database with a short url
                    if (docs.length == 0) {
                            // add the search request to the database and respond
                            db.collection('imagesearch').insert({ "requested": searchString });
                    } 
                });
        }
    });
};



