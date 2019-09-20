const router = require('express').Router();
const orderRouter = require('../controllers/orderController.js');
const auth = require('../helper/auth.js');

router.post('/create', auth, orderRouter.addOrder);
router.delete('/delete/:id', auth, orderRouter.deleteOrder);
router.get('/detail/:id', auth, orderRouter.getOrderDetail);
router.post('/add-product/:id', auth, orderRouter.addProduct);
router.get('/order-detail/:id', orderRouter.getDetail);
router.put('/update-order-detail/:id', auth, orderRouter.editProductOrder);
router.delete('/remove-product/:id', auth, orderRouter.removeProductOrder);
router.post('/checkout/:id', auth, orderRouter.checkout);

module.exports = router;
