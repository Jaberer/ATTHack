var MONGOLAB_ENDPOINT = 'mongodb://admin:password@ds047581.mongolab.com',
    PORT = '47581',
    DB = 'weelz';

var DISTANCE = 10000; // parameter for endpoints

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
mongoClient.connect(MONGOLAB_ENDPOINT + ":" + PORT + "/" + DB, function(err, db)
{
    if(err)
    {
        console.log("err: " + err);
    }
    mongoDatabase = db;
    console.log("connected to db: " + db);
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
            "loc" : {
                type: 'Point',
                coordinates: [
                    Number(_req.query['lng']),
                    Number(_req.query['lat'])
                ]
            },
            "message" : _req.query['message'],
            "type" : _req.query['type']
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

/**
 * Get pins endpoint
 */
app.get('/getPins', function(req, res){
    // Find documents near location
    if(req.query['loc'])
    {
        mongoDatabase.collection('pins').find({
            loc:{
                $near:{
                    $geometry:{
                        type:'Point',
                        coordinates:req.query['loc']
                    }
                },
                $maxDistance:DISTANCE
            }
        }, function(err, doc) {
            if(err) throw err;
            console.log(JSON.stringify(doc));
        });
    }
    else
    {
        throw new Error('loc parameter required');
    }
});

app.listen(8080);
console.log('Express server started on port 8080');