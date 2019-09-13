const router = require('express').Router();
const userRouter = require('../controllers/userController.js')
const auth = require('../helper/auth.js');

router.post('/create', userRouter.create);
router.post('/login', userRouter.login);
router.get('/info', auth, userRouter.detail);

module.exports = router;
