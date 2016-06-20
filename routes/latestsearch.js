var assert = require('assert');

module.exports = function(app, db) {
    app.get('/api/latest/imagesearch', function(request, response){
        // Get last 10 docs (requests) in the database
        db.collection('imagesearch').find().sort({$natural:-1}).limit(10).toArray(function(err, docs) {
                assert.equal(err, null);
                // if not in the database respond with error
                if (docs.length == 0) {
                    response.status(404).json({ error: "No History Found!"});
                } 
                // if it is in the database then respond with the result
                else {
                    var myData = [];
                    docs.forEach(function(doc, index) {
                       var obj = { 
                            term: doc.requested,
                            when:  dateFromObjectId(doc._id)
                        };
                        myData.push(obj);
                    });
                    response.json(myData);
                }
            });
    });
};

function dateFromObjectId(objectId) {
	return new Date(parseInt(objectId.toString().substring(0, 8), 16) * 1000);
}