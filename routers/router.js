const express = require('express');

const router = new express.Router();


router.get('/',(req,res)=>{
    try {
        res.send('main page');
    } catch (error) {
        res.status(500).send();
    }
});


module.exports = router;