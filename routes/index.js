var express = require('express');
var router = express.Router();

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID
// insert mongodb uri
const dbUrl = 'mongodb://'
let db

MongoClient.connect(dbUrl, {useNewUrlParser: true}, (err, client) => {
	if (err) console.log('Unable to connect to the Server', err)
	db = client.db('pest')
})

/* GET home page. */
router.get('/', function(req, res, next) {
  db.collection('data').find().toArray((err, result) => {
		if (err) {
			console.log(err)
    }
    console.log(result)
    res.render('dashboard/index', { title: 'Dashboard', result: result });
	})
});

module.exports = router;
