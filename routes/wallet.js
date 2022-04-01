const router = require('express').Router();
const walletController = require('../controller/wallet');

router.post('/create', walletController.post);
router.get('/balance', walletController.get);


module.exports = router;