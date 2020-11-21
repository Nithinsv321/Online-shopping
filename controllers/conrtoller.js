const session = require('express-session');

const logauth =(req,res,next)=>{
    if(!req.session.admin){
        res.redirect('/');
    }else{
        next();
    }
}

const auth = (req,res,next)=>{
    if(req.session.admin){
        res.redirect('/admin/home');
    }else{
        next();
    }
}

const userAuth = (req,res,next)=>{
    if(!req.session.user){
        res.redirect('/login');
    }else{
        next();
    }
}

module.exports = {logauth,auth,userAuth};