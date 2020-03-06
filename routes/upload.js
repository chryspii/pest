var express = require('express');
var router = express.Router();

const { exec } = require('child_process')
const date = require('date-and-time')
const fs = require('fs')
const multer = require('multer')
const now = new Date()

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

// Store Image
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/img/data')
	},
	filename: (req, file, cb) => {
		cb(null, dateToString(now) + file.originalname)
	}
})

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 25 * 1024 * 1024
	},
})

function dateToString(dates) {
	var dates = new Date(dates)
	var dates = date.format(dates, 'YYYYMMDDHHmmss')
	return dates
}

function sleep(time, callback) {
	var stop = new Date().getTime();
	while(new Date().getTime() < stop + time) {
		;
	}
	callback();
}

// Image Processing
router.post('/process', upload.single('image-crop'), (req, res) => {
	var filename = req.file.filename

	exec('darknet detector test requirement\\obj.data requirement\\obj-tiny.cfg backup\\obj-tiny_final.weights public\\img\\data\\'+filename+' gpu 0 -dont_show', (error, stdout, stderr) => {
	})

	sleep(7000, function() {
		exec('copy predictions.jpg public\\results\\images\\crop-'+dateToString(now)+filename+'.jpg', (error, stdout, stderr) => {
    })
    
    let data = {
      file_original   : filename,
      file_prediction : 'crop-'+dateToString(now)+filename+'.jpg',
      created_at      : new Date()
    }

    db.collection("data").insertOne(data, (err, result) => {
      if(err) console.log(err)
      res.render('image/result', {
        file_original: filename,
        file_box: 'crop-'+dateToString(now)+filename+'.jpg',
      })
    })
	})
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('image/upload', { title: 'Dashboard' });
});

module.exports = router;
