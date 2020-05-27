const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));

// ordem nao importa por causa do método que esta sendo usado
app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use((req,res,next) =>{
    res.status(404).sendFile(path.join(__dirname,'views','error.html'));
});

app.listen(3000);