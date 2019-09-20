const router = require('express').Router();
const profileRouter = require('../controllers/profileController.js');
const auth = require('../helper/auth.js');

router.post('/create', auth, profileRouter.create);
router.put('/update', auth, profileRouter.update);
router.get('/show/:id', profileRouter.show);
router.get('/history', auth, profileRouter.history);

module.exports = router;
