const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const notFoundController = require('./controllers/notFound')
const mongoConnect = require('./util/database').mongoConnect
const User = require('./models/user')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  User.findById('5f20d9593db4ce70107177ac')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id)
      next()
    })
    .catch(err => console.log(err))
})

// ordem nao importa por causa do método que esta sendo usado
app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(notFoundController.pageNotFound)

mongoConnect(() => {
  app.listen(3000)
})
