


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

app.get('/getPins', function(req, res){
    // Find one document in our collection
    db.collection('pins').find({loc:{$near:req.loc}}, function(err, doc) {

        if(err) throw err;

        res.render('hello', doc);
    });
});