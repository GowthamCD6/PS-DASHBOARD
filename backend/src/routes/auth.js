const express = require('express');
const router = express.Router();

const authControler = require('../controlers/authControler');

router.get('/app/getAppData', authControler.getAppData);


module.exports = router;