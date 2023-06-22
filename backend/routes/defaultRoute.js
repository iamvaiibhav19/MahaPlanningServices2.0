const express = require('express');

const router = express.Router();

//default route
router.route('/').get((req, res) => {
    res.send('Welcome to the LeadMagnetix');
});

module.exports = router;