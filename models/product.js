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
  constructor (title, imageUrl, description, price) {
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  save () {
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
}
