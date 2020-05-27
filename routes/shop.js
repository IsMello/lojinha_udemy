const path = require('path');

const express = require('express');

const router = express.Router();

router.get("/",(req,res,next) =>{
    //use path.join to create path that work on both OS
    res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
});

module.exports = router;