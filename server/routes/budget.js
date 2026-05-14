const express = require('express');
const router = express.Router();
const { getBudget, setBudget } = require('../controllers/budgetController');
const auth = require('../middleware/auth');

router.route('/')
    .get(auth, getBudget)
    .post(auth, setBudget);

module.exports = router;
