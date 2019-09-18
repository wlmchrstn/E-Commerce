const router = require('express').Router();
const productRouter = require('../controllers/productController.js');
const auth = require('../helper/auth.js');

router.post('/create', auth, productRouter.createProduct);
router.get('/list', productRouter.getAllProduct);
router.get('/detail/:id', productRouter.getProductDetail);
router.put('/update/:id', auth, productRouter.editProduct);
router.delete('/delete/:id', auth, productRouter.deleteProduct);

module.exports = router;
