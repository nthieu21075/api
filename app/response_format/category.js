const R = require('ramda')

const categorySerializer = (category) =>({
    name: category.name,
    imageUrl: category.imageUrl
})

exports.categorySerializer = categorySerializer
exports.categoriesSerializer = R.map(categorySerializer)