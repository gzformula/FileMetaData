var assert = require('assert');

module.exports = function(app, db) {
    app.get('/:shorturl', function(request, response){
        var shorturl = parseInt(request.params.shorturl);
        console.log("shorturl was requested.", shorturl);
        // check if url is in the database
        db.collection('urls').find({ "_id": shorturl }).toArray(function(err, docs) {
                assert.equal(err, null);
                // if not in the database respond with error
                if (docs.length == 0) {
                    response.status(404).json({ error: "short URL invalid"});
                } 
                // if it is in the database then respond with the result
                else {
                    response.redirect(docs[0].long_url);
                }
                
            });
        
    });
};