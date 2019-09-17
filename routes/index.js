const router = require('express').Router();
const userRouter = require('./userRouter.js');
const productRouter = require('./productRouter.js');
const profileRouter = require('./profileRouter.js');
const uploadRouter = require('./uploadRouter.js');

router.use('/user', userRouter);
router.use('/profile', profileRouter);
router.use('/product', productRouter)
router.use('/upload', uploadRouter);

module.exports = router;
