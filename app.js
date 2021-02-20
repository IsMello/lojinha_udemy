const path = require('path')
// const https = require('https')
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
require('dotenv').config()
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const fs = require('fs')

const app = express()
const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: 'sessions'
})

const csrfProtection = csrf()

// const privateKey = fs.readFileSync('server.key')
// const certificate = fs.readFileSync('server.cert')

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    callback(null, new Date().toISOString() + '-' + file.originalname)
  }
})
const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    callback(null, true)
  } else {
    callback(null, false)
  }
}
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
)

app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(morgan('combined', { stream: accessLogStream }))

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

app.use(helmet())
app.use(compression())

const errorController = require('./controllers/error')
const User = require('./models/user')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
)
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
)

app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use((req, res, next) => {
  // throw new Error('Sync dummy')
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next()
      }
      req.user = user
      next()
    })
    .catch(err => {
      next(new Error(err))
    })
})

// ordem nao importa por causa do método que esta sendo usado
app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.get('/500', errorController.get500)
app.use(errorController.pageNotFound)

app.use((error, req, res, next) => {
  console.log(error)
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500'
  })
})

mongoose
  .connect(process.env.MONGODB_URL)
  .then(result => {
    // https.
    // createServer({key: privateKey, cert: certificate}, app).
    // listen(3000)
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
