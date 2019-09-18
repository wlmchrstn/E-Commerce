const router = require('express').Router();
const auth = require('../helper/auth.js');
const Product = require('../models/product.js');
const multer= require('multer');
const Datauri = require('datauri');
const datauri = new Datauri();
const cloudinary = require('cloudinary').v2
const {success, error} = require('../helper/resFormatter.js')

// require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const upload = multer().single('preview')

// Upload Single File
router.post('/:id', upload, auth, function(req, res){
                        const file = datauri.format(`${req.file.originalname}-${Date.now()}`, req.file.buffer);
                        cloudinary.uploader.upload(file.content)
                        .then(data =>{
                            Product.findOneAndUpdate({_id: req.params.id},
                                {
                                    $set: {preview: data.url},
                                    
                                }, 
                                {new: true}, 
                                function(err, result){    
                                   res.status(200).json( success(result, 'Picture uploaded!') )
                                }
                            )
                        })
                        .catch(err => {
                            res.status(422).json( error('Unexpected error! Failed to upload picture!') );
                            })
                    })

module.exports = router;
