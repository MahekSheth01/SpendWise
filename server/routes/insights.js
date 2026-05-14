const express = require('express');
const router = express.Router();
const { getInsights } = require('../controllers/insightController');
const auth = require('../middleware/auth');

router.get('/', auth, getInsights);

module.exports = router;
