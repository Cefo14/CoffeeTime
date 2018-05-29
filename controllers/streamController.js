'use strict';

const mime = require('mime')
const torrentStream = require('torrent-stream')
const request = require('request-promise');
const cheerio = require('cheerio');
const options = {
	torrentStream : {
		uploads: 1,
		trackers: [
			'http://share.camoe.cn:8080/announce',
			'udp://tracker.torrent.eu.org:451/announce',
			'http://t.nyaatracker.com:80/announce',
			'udp://tracker.doko.moe:6969/announce',
			'http://asnet.pw:2710/announce',
			'udp://thetracker.org:80/announce',
			'http://tracker.tfile.co:80/announce',
			'http://pt.lax.mx:80/announce',
			'udp://santost12.xyz:6969/announce',
			'https://tracker.bt-hash.com:443/announce',
			'udp://bt.xxx-tracker.com:2710/announce',
			'udp://tracker.vanitycore.co:6969/announce',
			'udp://zephir.monocul.us:6969/announce',
			'http://grifon.info:80/announce',
			'http://retracker.spark-rostov.ru:80/announce',
			'http://tr.kxmp.cf:80/announce',
			'http://tracker.city9x.com:2710/announce',
			'udp://bt.aoeex.com:8000/announce',
			'http://tracker.tfile.me:80/announce',
			'udp://tracker.tiny-vps.com:6969/announce',
			'http://retracker.telecom.by:80/announce',
			'http://tracker.electro-torrent.pl:80/announce',
			'udp://tracker.tvunderground.org.ru:3218/announce',
			'udp://tracker.halfchub.club:6969/announce',
			'udp://retracker.nts.su:2710/announce',
			'udp://wambo.club:1337/announce',
			'udp://tracker.dutchtracking.com:6969/announce',
			'udp://tc.animereactor.ru:8082/announce',
			'udp://tracker.justseed.it:1337/announce',
			'udp://tracker.leechers-paradise.org:6969/announce',
			'udp://tracker.opentrackr.org:1337/announce',
			'https://open.kickasstracker.com:443/announce',
			'udp://tracker.coppersurfer.tk:6969/announce',
			'udp://open.stealth.si:80/announce',
			'http://retracker.mgts.by:80/announce',
			'http://retracker.bashtel.ru:80/announce',
			'udp://inferno.demonoid.pw:3418/announce',
			'udp://tracker.cypherpunks.ru:6969/announce',
			'udp://tracker.cyberia.is:6969/announce',
			'http://tracker.devil-torrents.pl:80/announce',
			'udp://tracker2.christianbro.pw:6969/announce',
			'udp://retracker.lanta-net.ru:2710/announce',
			'udp://tracker.internetwarriors.net:1337/announce',
			'udp://ulfbrueggemann.no-ip.org:6969/announce',
			'http://torrentsmd.eu:8080/announce',
			'udp://peerfect.org:6969/announce',
			'udp://tracker.swateam.org.uk:2710/announce',
			'http://ns349743.ip-91-121-106.eu:80/announce',
			'http://torrentsmd.me:8080/announce',
			'http://agusiq-torrents.pl:6969/announce',
			'http://fxtt.ru:80/announce',
			'udp://tracker.vanitycore.co:6969/announce',
			'udp://explodie.org:6969',
			'http://0d.kebhana.mx:443/announce',
			'udp://tracker.uw0.xyz:6969/announce',
			'udp://tracker-2.msm8916.com:6969/announce',
			'udp://public.popcorn-tracker.org:6969/announce',
			'udp://9.rarbg.com:2710/announce',
			'udp://tracker.open-internet.nl:6969/announce',
			'udp://tracker.skyts.net:6969/announce',
			'udp://tracker.piratepublic.com:1337/announce',
			'udp://9.rarbg.to:2710/announce',
			'udp://tracker4.itzmx.com:2710/announce',
			'udp://tracker1.wasabii.com.tw:6969/announce',
			'udp://tracker.zer0day.to:1337/announce',
			'udp://tracker.xku.tv:6969/announce',
			'udp://ipv4.tracker.harry.lu:80/announce',
			'udp://open.facedatabg.net:6969/announce',
			'udp://mgtracker.org:6969/announce',
			'udp://tracker.mg64.net:6969/announce',
		]
	},
}

const host = 'https://1337x.to'

exports.search = (req, res) => {
	const search = req.body.search
	const url = host + '/category-search/'+ search +'/Music/1/'

	const values = []

	req.session.magnament = null;

	request(url)
		.then((html) => {
			const $ = cheerio.load(html)
			$(".coll-1 a[href*='torrent']").each((i, elem) => {
				const name = $(elem).text()
				let uri = $(elem).attr('href')
				values.push({name : name, url : uri})
			})
			res.json(values)
		})

    	.catch((err) => {
    		res.sendStatus(404)
    		console.log(err)
    	})
}

exports.show = (req, res) => {
	
	const url = host + req.body.url
	let magnament

	request(url)
		.then((html) => {
			const $ = cheerio.load(html)
			
			$(".download-links-dontblock li a[href*='magnet']").each((i, elem) => {
				magnament = $(elem).attr('href')
			})

			const engine = torrentStream(magnament, options.torrentStream)
			const filesNames = []
			req.session.magnament = magnament

			engine.on('ready', () => {
				engine.files.forEach((file, index) => {
					const type = mime.lookup(file.path)
					if(/audio/.test(type))
						filesNames.push({ id:index, name: file.name, type:type })
				});
				res.json(filesNames)
			})
		})

    	.catch((err) => {
    		res.sendStatus(404)
    		console.log(err)
		})
}

exports.stream = (req, res) => {
	const magnament = req.session.magnament
	const engine = torrentStream(magnament, options.torrentStream)

	engine.on('ready', () => {
		const index = req.params['id']
		
		const file = engine.files[index]
		const type = mime.lookup(file.path)

		const stream = file.createReadStream()
		
		res.header('Content-Type', type)
		res.header('Content-Length', file.length)
		res.header('Accept-Ranges', 'bytes')
		
		stream.on('data', (chuck) => {
			res.write(chuck)
		})

		stream.on('error', () => {
			res.sendStatus(404)
		})

		stream.on('end', () => {
			res.end()
		});
	})
}