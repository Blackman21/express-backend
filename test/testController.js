"use strict";

const router = require('express').Router();

function index(req, res){
    res.json({response:'index'})
}

router.get('/', [index]);

module.exports = router;
