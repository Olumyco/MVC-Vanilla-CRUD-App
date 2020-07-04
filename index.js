const express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	// database......
	low = require('lowdb'),
	FileSync = require('lowdb/adapters/FileSync'),
	adapter = new FileSync('db.json'),
	db = low(adapter);

db.defaults({
		posts: [],
		user: {}
	})
	.write();


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/serve', (req, res) => {
	res.json({
		myDb: db.get('posts').value()
	});
});

app.post('/add', (req, res) => {
	console.log(req.body);
	db.get('posts').push(req.body).write();
	res.json({
		myDb: db.get('posts').value()
	});
});

app.put('/update', (req, res) => {
	console.log(req.body);
	let num = Number(req.body.toUpdate);
	let all = db.get('posts').value();
	for (let k = 0; k < all.length; k++) {
		if (num === k) {
			console.log(all[k]);
			db.get('posts').find({
				topic: all[k].topic
			}).assign({
				topic: req.body.topic,
				content: req.body.content
			}).write();
		}
	}
	res.json({
		d: db.get('posts').value()
	});
});


app.delete('/remove', (req, res) => {
	console.log(req.body);
	let num = Number(req.body.toRemove),
		all = db.get('posts').value();
	for (let k = 0; k < all.length; k++) {
		if (num === k) {
			console.log(all[k]);
			db.get('posts').remove(all[k]).write();
		}
	}
	res.json({
		d: db.get('posts').value()
	});
});

app.listen(4000, () => {
	console.log('Server listening on port 4000');
});
