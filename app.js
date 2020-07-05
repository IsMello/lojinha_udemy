const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const notFoundController = require('./controllers/notFound')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// ordem nao importa por causa do método que esta sendo usado
app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(notFoundController.pageNotFound)

app.listen(3000)
