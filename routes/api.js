var express = require('express');
var sas = require('./sas');

var router = express.Router();

router.use('/sas', sas);

module.exports = router;