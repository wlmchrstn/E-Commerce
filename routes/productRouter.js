const router = require('express').Router();
const productRouter = require('../controllers/productController.js');
const auth = require('../helper/auth.js');

router.post('/create/:id', auth, productRouter.createProduct);
router.get('/detail/:id', productRouter.getProduct);
router.put('/update/:id', auth, productRouter.editProduct);
router.delete('/delete/:id/:product', auth, productRouter.deleteProduct);

module.exports = router;
