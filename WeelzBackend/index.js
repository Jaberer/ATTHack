var MONGOLAB_ENDPOINT = 'ds047581.mongolab.com';

var express = require('express'),
    app = express(),
    cons = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// connect to mongoLab
var mongoClient = new MongoClient(new Server(MONGOLAB_ENDPOINT, 47581));

// get document
var db = mongoClient.db('weelz');

/**
 * This gets all
 */
db.collection('pins').find().toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
});

/**
 * Inserts a pin
 */
app.get('/insertPin', function(req, res){
    insertDocument(db, req, res, function() {
        db.close();
    });
});


/**
 * Insert Pin helper method
 * @param db
 * @param callback
 */
var insertDocument = function(_db, _req, _res, callback) {
    _db.collection('pins').insert( {
        "pin" : {
            "loc" : _req.query['loc'],
            "message" : _req.query['message'],
            "type" : _req.query['type']
        }
    }, function(err, result) {
        //assert.equal(err, null);
        //callback(err, result);
        if(err)
        {
            console.log(JSON.stringify(err));
            callback(err);
        }
        callback(result);
    });
};

mongoClient.open(function(err, mongoClient) {
    if(err) throw err;

    app.listen(8080);
    console.log('Express server started on port 8080');
});