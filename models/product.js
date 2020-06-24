const fs = require('fs')
const path = require('path')
const productsFilePath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json')

const getProductsFromFile = (handleProductsCallback) => {
  fs.readFile(productsFilePath, (err, fileContent) => {
    if (err) {
      handleProductsCallback([])
    } else {
      handleProductsCallback(JSON.parse(fileContent))
    }
  })
}

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save () {
    this.id = Math.random().toString()
    getProductsFromFile(products => {
      products.push(this)
      fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
        console.log(err)
      })
    })
  }

  static fetchAll (callback) {
    getProductsFromFile(callback)
  }

  static findById (id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id)
      cb(product)
    })
  }
}
