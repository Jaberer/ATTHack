app.get('/getPins', function(req, res){

    // Find one document in our collection
    db.collection('pins').find({loc:{$near:req.query['loc']}}, function(err, doc) {

        if(err) throw err;

        res.render('hello', doc);
    });
});