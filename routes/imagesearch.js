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
            client.search('Steve Angello')
                .then(function (images) {
                    /*
                    [{
                        "url": "http://steveangello.com/boss.jpg",
                        "type": "image/jpeg",
                        "width": 1024,
                        "height": 768,
                        "size": 102451,
                        "thumbnail": {
                            "url": "http://steveangello.com/thumbnail.jpg",
                            "width": 512,
                            "height": 512
                        }
                    }]
                     */
                });
                if (pageNum > 0) {
                    // paginate results
                    client.search('Steve Angello', {
                        page: 2
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



