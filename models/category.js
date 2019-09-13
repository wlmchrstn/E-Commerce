const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        unique: true,
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
})

var Category = mongoose.model('Category', categorySchema);

Category.createCategory = async function(data) {
    return new Promise(async function(resolve, reject) {
        let product = await Product.findOne({
            category: data.category
        })
        if(product) {
            return reject ([400, "Product is already available!"])
        }

        Category.create(data)
            .then(result => {
                resolve([201, result, 'Category created!'])
            })
            .catch(err => {
                reject([422, 'Unexpected error! Failed to create category!'])
            })
    })
}

categorySchema.plugin(uniqueValidator)
module.exports = Category;

