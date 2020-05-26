const express = require('express');

const router = express.Router();

router.use("/",(req,res,next) =>{
    res.send("<h1>Bem vindo</h1>");
});

module.exports = router;