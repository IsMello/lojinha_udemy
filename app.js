const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));

// app.use((req,res,next) =>{
//     console.log("Ola")
//     next();
// })

// app.use((req,res,next) =>{
//     console.log("Tudo bem?")
//     res.send("<h1>Oiiii</h1>")
// })

//mais específico primeiro, porque senão a url vai dar match com somente o / (que é o que começa), e vai chamar a função que lida com /
app.use("/users",(req,res,next) =>{
    res.send("<h1>Sem usuários no momento</h1>");
    next();
});

app.use("/add-product",(req,res,next) =>{
    console.log("in another middleware");
    res.send('<form action="/product method="POST"><input type="text" name="title"<button type="submit">Add Product</button></form>')
});

app.use('/product', (req, res, next) => {
    console.log(req.body)
    res.redirect('/');
})

app.use("/",(req,res,next) =>{
    console.log("Ola")
    res.send("<h1>Bem vindo</h1>")
});

app.listen(3000);