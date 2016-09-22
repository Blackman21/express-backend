"use strict";

const router = require('express').Router(),
    bodyNotNullMiddleware = require('../src/middlewares/bodyNotNullMiddleware');

function index(req, res){
    res.json({response:'index'})
}

router.get('/', [index]);

router.post('/body-null', [bodyNotNullMiddleware, index]);

module.exports = router;
