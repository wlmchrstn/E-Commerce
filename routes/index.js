const router = require('express').Router();
const userRouter = require('./userRouter.js');
const productRouter = require('./productRouter.js');
const profileRouter = require('./profileRouter.js');

router.use('/user', userRouter);
router.use('/profile', profileRouter);
router.use('/product', productRouter)

module.exports = router;
