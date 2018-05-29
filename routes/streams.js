'use strict';

const express = require('express')
const router = express.Router()

var streamController = require('../controllers/streamController');

router.post('/search', streamController.search)

router.post('/show', streamController.show)

router.get('/stream/:id([0-9]+)', streamController.stream)

module.exports = router;