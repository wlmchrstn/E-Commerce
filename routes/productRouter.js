const router = require('express').Router();
const productRouter = require('../controllers/productController.js');

router.post('/create', productRouter.createProduct);
router.get('/show-all', productRouter.getProduct);
router.put('/update', productRouter.editProduct);
router.delete('/delete', productRouter.deleteProduct);

module.exports = router;
