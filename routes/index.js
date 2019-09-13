const router = require('express').Router();
const userRouter = require('./userRouter.js');
const productRouter = require('./productRouter.js');

router.use('/user', userRouter)
router.use('/product', productRouter)

module.exports = router;
