const express = require('express');
const router = express.Router();

/* GET channel details. */
router.get('/:channelName/', (req, res, next) => {
  let channelName = req.params.channelName;
  res.render('channel', { title: channelName, channelName: channelName });
});

module.exports = router;
