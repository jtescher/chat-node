const express = require('express');
const router = express.Router();

/* GET channel details. */
router.get('/:channel/', (req, res, next) => {
  let channel = req.params.channel;
  res.render('channel', { title: channel, channel: channel });
});

module.exports = router;
