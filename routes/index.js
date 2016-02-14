const express = require('express');
const router = express.Router();

const channelNames = require('../models/channel').allChannelNames;
const title = "Channels"

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title, channelNames });
});

module.exports = router;
