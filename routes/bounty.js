const express = require('express');
const bountyController = require('../controllers/bounty');

const router = express.Router();


router.get('/all', bountyController.getAllBounties);   

router.post('/submit', bountyController.submitBountyAnswer);

router.get('/:id', bountyController.getBountyById);

module.exports = router;
