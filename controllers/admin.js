const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    product: {}
  })
}

exports.pushProduct = (req, res, next) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description
    })
    .then(result => {
      // console.log(result)
      console.log('Created product!')
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId
  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then(products => {
      const product = products[0]
      if (!products) {
        return res.redirect('/')
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId
  const updatedTile = req.body.title
  const updatedImageUrl = req.body.imageUrl
  const updatedPrice = req.body.price
  const updatedDescription = req.body.description
  Product.findByPk(prodId)
    .then(product => {
      product.title = updatedTile
      product.price = updatedPrice
      product.description = updatedDescription
      product.imageUrl = updatedImageUrl
      return product.save()
    })
    .then(result => {
      // porque dois .then?
      console.log('UPDATED PRODUCT')
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then(rows => {
      res.render('admin/products', {
        products: rows,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.findByPk(productId)
    .then(product => {
      return product.destroy()
    })
    .then(result => {
      console.log('DESTROY')
      res.redirect('/admin/products')
    })
    .catch()
}
