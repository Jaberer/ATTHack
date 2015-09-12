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
var mongoclient = new MongoClient(new Server(MONGOLAB_ENDPOINT, 47581));

// get document
var db = mongoclient.db('weelz');

db.collection('pins').find().toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
});

app.get('/insertPin', function(req, res){
    db.inventory.insert({
        // pin object here
    });
});