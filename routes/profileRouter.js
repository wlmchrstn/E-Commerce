const router = require('express').Router();
const profileRouter = require('../controllers/profileController.js');
const auth = require('../helper/auth.js');

router.post('/create', auth, profileRouter.create);
router.put('/update/:id', auth, profileRouter.update);
router.get('/show/:id', auth, profileRouter.show);
router.get('/shop', profileRouter.shop);

module.exports = router;
