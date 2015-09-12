var MONGOLAB_ENDPOINT = 'mongodb://admin:password@ds047581.mongolab.com',
    PORT = '47581',
    DB = 'weelz';

//var distance = 10000; // parameter for endpoints

var express = require('express'),
    app = express(),
    cons = require('consolidate'),
    mongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    Server = require('mongodb').Server;

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// connect to mongoLab
//var mongoclient = new mongoClient(new Server(MONGOLAB_ENDPOINT, 47581));
var mongoDatabase;

/**
 * voting endpoint
 * todo: track users
 */
app.get('/vote', function(req, res){
    mongoClient.connect(MONGOLAB_ENDPOINT + ":" + PORT + "/" + DB, function(err, db)
    {
        if(err)
        {
            console.log("err: " + err);
        }
        mongoDatabase = db;
        console.log("connected to db: " + db);
    });
    if(mongoDatabase)
    {
        vote(mongoDatabase, req, res, function(err, pin){
            if(err)
            {
                console.log('Error while logging vote: ' + err);
                return res.send(err);
            }    
            else if(pin)
            {
                return res.send(pin);
            }
        });
        mongoDatabase.close();
    }
});

/**
 * Voting helper method
 * @param _db
 * @param _req
 * @param _res
 * @param callback
 */
function vote(_db, _req, _res, callback)
{
    if(_req.query['vote']==='up')
    {
        console.log('upvote!');
        _db.collection('pins').update({
            _id: new ObjectID('55f479d990b18bdff686623c')

        },
        {
            $inc:{
                upvotes: 1
            }
        },
        function(err, result) {
            if(err)
            {
                console.log('err: ' + err);
            }
            console.log('result: ' + result);
            callback(err, result);
        });
    }
    else
    {
        console.log('downvote!');
        _db.collection('pins').update({
            _id: new ObjectID('55f479d990b18bdff686623c')
        },
        {
            $inc:{
                downvotes: 1
            }
        },
        function(err, result) {
            if(err)
            {
                console.log('err: ' + err);
            }
            console.log('result: ' + result);
            callback(err, result);
        });
    }
}

/**
 * Inserts a pin
 */
app.get('/insertPin', function(req, res){
    mongoClient.connect(MONGOLAB_ENDPOINT + ":" + PORT + "/" + DB, function(err, db)
    {
        if(err)
        {
            console.log("err: " + err);
        }
        mongoDatabase = db;
        console.log("connected to db: " + db);
    });
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
                return res.send(pin);
            }
        });
        mongoDatabase.close();
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
            'type' : _req.query['type'],
            'upvotes' : 1,
            'downvotes' : 0
        },
        function(err, result) {
            if(err)
            {
                console.log('err: ' + err);
            }
            console.log('result: ' + result);
            //assert.equal(err, null);
            callback(null, result);
        });
};


/**
 * get pins endpoint
 * console example
 * db.pins.find({loc:{$near: loc2}})
 */
app.get('/getPins', function(req, res){
    mongoClient.connect(MONGOLAB_ENDPOINT + ":" + PORT + "/" + DB, function(err, db)
    {
        if(err)
        {
            console.log("err: " + err);
        }
        mongoDatabase = db;
        console.log("connected to db: " + db);
    });
    if(mongoDatabase)
    {
        getPins(mongoDatabase, req, res, function(err, pins) {
            if(pins)
            {
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
        mongoDatabase.close();
    }
});

/**
 * Get pins helper method
 */
function getPins(_db, _req, _res, callback){
    var distance=10000;
    if(_req.query['radius'])
        distance=Number(_req.query['radius']);
    _db.collection('pins').find({
        loc: {
            $near: {
                type: 'Point',
                coordinates: [
                    Number(_req.query['lng']),
                    Number(_req.query['lat'])
                ],
                $maxDistance: distance
                // Max and Min distance here
            }
        }
    }).toArray(function(err, json){
        console.log(json);
        if(err) callback(err);
        else callback(null, json);
    });
}

app.listen(8080);
console.log('Express server started on port 8080');