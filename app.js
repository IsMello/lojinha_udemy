const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

//mais específico primeiro, porque senão a url vai dar match com somente o / (que é o que começa), e vai chamar a função que lida com /

app.use("/add-product",(req, res) =>{
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>')
});

app.post('/product', (req,res) => {
    console.log(req.body);
    res.redirect('/');
})

app.use("/",(req,res,next) =>{
    res.send("<h1>Bem vindo</h1>");
});

app.listen(3000);