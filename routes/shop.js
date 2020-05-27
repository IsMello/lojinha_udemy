const path = require('path');

const express = require('express');

const rootDir = require('../util/path')

const router = express.Router();

router.get("/",(req,res,next) =>{
    //use path.join to create path that work all OS
    res.sendFile(path.join(rootDir, '..', 'views', 'shop.html'));
});

module.exports = router;