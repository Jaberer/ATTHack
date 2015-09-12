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
    if(mongoDatabase)
    {
        insertDocument(mongoDatabase, req, res, function(err, pin) {
            if(err)
            {
                console.log('Error while inserting: ' + err);
                return res.send(err);

            }
            else if(pin)
            {
                console.log('yay');
                return res.send(pin);
            }
        });
    }
});


/**
 * Insert Pin helper method
 * @param db
 * @param callback
 */
function insertDocument(_db, _req, _res, callback) {
    _db.collection('pins').insert({
            'loc' : {
                type: 'Point',
                coordinates: [
                    Number(_req.query['lng']),
                    Number(_req.query['lat'])
                ]
            },
            'message' : _req.query['message'],
            'type' : _req.query['type']
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
 * get pins endpoint
 * console example
 * db.pins.find({loc:{$near: loc2}})
 */
app.get('/getPins', function(req, res){
    if(mongoDatabase)
    {
        getPins(mongoDatabase, req, res, function(err, pins) {
            if(pins)
            {
                console.log('yay');
                return res.send(pins);

            }
            else if(err)
            {
                console.log('Error in finding pins: ' + err);
                return res.send('Error in finding pins: ' + err);

            }
            console.log('No pins found');
            res.send('No pins found'); // querying is incorrect... should be returning something not null
        });
    }
});

/**
 * Get pins helper method
 */
function getPins(_db, _req, _res, callback){

    _db.collection('pins').find({
        
    }).toArray(function(err, json){
        console.log(json);
        if(err) callback(err);
        else callback(null, json);
    });

    //if(cursorObject)
    //{
    //    //res.send(cursorObject.toArray());
    //    console.log(cursorObject.toArray(
    //        function(err, jsonObject) {
    //
    //        }));
    //    callback(null, cursorObject.toArray());
    //}
    //else
    //{
    //    callback();
    //}
    //cursorObject.each(function(error, document){
    //    //assert.equal(err, null);
    //    if (document != null) {
    //        console.log(document);
    //    } else {
    //        callback();
    //    }
    //});
    //
    //// Find documents near location
    //_db.collection('pins').find({
    //    loc: {
    //        $near: {
    //            type: 'Point',
    //            coordinates: [
    //                70, 15
    //            ]
    //            // Max and Min distance here
    //        }
    //    }
    //},
    //function(err, cursor) {
    //    if(err) {
    //        console.log('error in getting pins: ' + err);
    //        callback(err, null);
    //    }
    //
    //    //var docs = cursor.toArray(function (err, result) {
    //    //    console.log(err, result);
    //    //});
    //
    //    //console.log("Found the following records: " + docs); // getting really close! No error!
    //    //callback(err, docs); // return it back to endpoint callback
    //
    //    console.log("Found the following records: " + JSON.stringify(cursor)); // getting really close! No error!
    //    callback(err, cursor); // return it back to endpoint callback
    //});
}

app.listen(8080);
console.log('Express server started on port 8080');