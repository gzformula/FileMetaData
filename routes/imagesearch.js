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
            // add the search request to the database 
            console.log("Insert search to db");
            db.collection('imagesearch').insert({ "requested": searchString });

                
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
        }
    });
};

var objectIdFromDate = function (date) {
	return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
};

var dateFromObjectId = function (objectId) {
	return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};



