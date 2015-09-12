var MONGOLAB_ENDPOINT = 'mongodb://admin:password@ds047581.mongolab.com',
    PORT = '47581',
    DB = 'weelz';

var express = require('express'),
    app = express(),
    cons = require('consolidate'),
    mongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// connect to mongoLab
//var mongoclient = new mongoClient(new Server(MONGOLAB_ENDPOINT, 47581));
var mongoDatabase;
mongoClient.connect(MONGOLAB_ENDPOINT, function(err, db)
{
    if(err)
    {
        console.log("err: " + err);
    }
    mongoDatabase = db;
    console.log("connected to db: "  + db);
});

// get document
//var db = mongoclient.db('weelz');

/**
 * This gets all
 */
//mongoDatabase.collection('pins').find().toArray(function(err, result) {
//    if (err) throw err;
//    console.log(result);
//});

/**
 * Inserts a pin
 */
app.get('/insertPin', function(req, res){
    insertDocument(mongoDatabase, req, res, function() {
        mongoDatabase.close();
    });
});


/**
 * Insert Pin helper method
 * @param db
 * @param callback
 */
function insertDocument(_db, _req, _res, callback) {
    _db.collection('pins').insert({
        "pin" : {
            "loc" : _req.query['loc'],
            "message" : _req.query['message'],
            "type" : _req.query['type']
        }
    },
    function(err, result) {
        if(err)
        {
            console.log(err);
        }
        //assert.equal(err, null);
        callback(result);
    });
};