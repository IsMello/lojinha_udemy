const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

const notFoundController = require('./controllers/notFound')
const User = require('./models/user')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  User.findById('5f24d7bd0884be72c64610eb')
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => console.log(err))
})

// ordem nao importa por causa do método que esta sendo usado
app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.use(notFoundController.pageNotFound)

mongoose
  .connect(
    process.env.MONGODB_URL
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Thais',
          email: 'thais@mail.com',
          cart: {
            items: []
          }
        })
        user.save()
      }
    })
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
