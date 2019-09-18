const router = require('express').Router();
const orderRouter = require('../controllers/orderController.js');
const auth = require('../helper/auth.js');

router.post('/create', auth, orderRouter.addOrder);
router.delete('/delete/:id', auth, orderRouter.deleteOrder);
router.post('/add-product/:id', auth, orderRouter.addToOrder);
router.get('/order-detail/:id', auth, orderRouter.getOrderDetail);
router.put('/update-order-detail/:id', auth, orderRouter.editProductOrder);
router.delete('/remove-product/:id', auth, orderRouter.deleteOrder);

module.exports = router;
