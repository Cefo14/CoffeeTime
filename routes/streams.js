var express = require('express');
var router = express.Router();

var mime = require('mime');
var onFinished = require('on-finished');
var torrentStream = require('torrent-stream');

/* GET make streaming */
router.get('/stream/:id', function(req, res, next) 
{
	const engine = torrentStream(req.session.magnament);
	engine.on('ready', () => {
		const index = parseInt(req.params["id"]);
		pipe(res, engine.files[index]);
	});
});

/* GET return a name files ant set magnament on session*/
router.post('/show', function(req, res, next) 
{
	req.session.magnament = req.body.magnament;
	const engine = torrentStream(req.body.magnament);
	let filesNames = [];
	engine.on('ready', () => {
		engine.files.forEach((file, index) => {
			mime.lookup(file.path) === "audio/mpeg" ? filesNames.push({ id:index, name: file.name }) : true
		});
		res.json(filesNames);
	});
});

function pipe (res, file) 
{
	let stream;
	const type = mime.lookup(file.path);
	
	res.header('Content-Type', type);
	res.header('Content-Length', file.length);
	res.header('Accept-Ranges', 'bytes');
	
	stream = file.createReadStream();
	
	onFinished(res, () => stream && stream.destroy());

	// Make a stream
	stream.pipe(res);
}

module.exports = router;
