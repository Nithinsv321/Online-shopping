const express = require('express');

const router = new express.Router();


router.get('/',(req,res)=>{
    try {
        res.send('<a href="/admin/login">admin</a>');
    } catch (error) {
        res.status(500).send();
    }
});


module.exports = router;