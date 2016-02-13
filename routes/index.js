const express = require('express');
const router = express.Router();

const channels = require('../models/channel').allChannels;
const title = "Channels"

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title, channels });
});

module.exports = router;
