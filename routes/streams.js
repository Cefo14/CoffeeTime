'use strict';

const express = require('express')
const router = express.Router()
const mime = require('mime')
const torrentStream = require('torrent-stream')

/* GET make streaming */
router.get('/stream/:id', function(req, res, next) 
{
	const engine = torrentStream(req.session.magnament)
	let stream

	engine.on('ready', () => {
		stream ? stream.destroy() : null
		const index = parseInt(req.params["id"])
		let file = engine.files[index]
		const type = mime.lookup(file.path)
		
		res.header('Content-Type', type)
		res.header('Content-Length', file.length)
		res.header('Accept-Ranges', 'bytes')

		stream = file.createReadStream()
		stream.pipe(res)
	})

	engine.on('idle', () => stream ? stream.destroy() : null)
	engine.on('download', (data) => console.log(data))
})

/* GET return a name files ant set magnament on session*/
router.post('/show', function(req, res, next) 
{
	req.session.magnament = req.body.magnament
	const engine = torrentStream(req.body.magnament)
	let filesNames = []
	engine.on('ready', () => {
		engine.files.forEach((file, index) => {
			mime.lookup(file.path) === "audio/mpeg" ? filesNames.push({ id:index, name: file.name }) : true
		});
		res.json(filesNames)
	});
});

module.exports = router;
