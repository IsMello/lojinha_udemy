const fs = require('fs')
const path = require('path')
const Cart = require('./cart')
const productsFilePath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
)

const getProductsFromFile = handleProductsCallback => {
  fs.readFile(productsFilePath, (err, fileContent) => {
    if (err) {
      handleProductsCallback([])
    } else {
      handleProductsCallback(JSON.parse(fileContent))
    }
  })
}

module.exports = class Product {
  constructor (id, title, imageUrl, price, description) {
    this.id = id
    this.title = title
    this.imageUrl = imageUrl
    this.price = price
    this.description = description
  }

  save () {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(prod => prod.id === this.id)
        const updatedProducts = [...products]
        updatedProducts[existingProductIndex] = this
        fs.writeFile(productsFilePath, JSON.stringify(updatedProducts), err => {
          console.log(err)
        })
      } else {
        this.id = Math.random().toString()
        products.push(this)
        fs.writeFile(productsFilePath, JSON.stringify(products), err => {
          console.log(err)
        })
      }
    })
  }

  static deletById (id) {
    getProductsFromFile(products => {
      const product = products.find(product => product.id === id)
      const updatedProducts = products.filter(product => product.id !== id)
      fs.writeFile(productsFilePath, JSON.stringify(updatedProducts), err => {
        if (!err) {
          Cart.deleteProduct(id, product.price)
        }
      })
    })
  }

  static fetchAll (callback) {
    getProductsFromFile(callback)
  }

  static findById (id, cb) {
    getProductsFromFile(products => {
      const product = products.find(product => product.id === id)
      cb(product)
    })
  }
}
