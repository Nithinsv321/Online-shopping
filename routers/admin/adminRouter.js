const {logauth,auth} = require('../../controllers/conrtoller');
const express = require('express');
require('../../db/connection');
const router = new express.Router();
const session = require('express-session');
const bcrypt = require('bcryptjs')
const Admin = require('../../models/admin');

//admin 
// get -------------------------------------------------------------------------------------
// home
router.get('/home',logauth, (req, res) => {
    try {
        res.render('admin/index',{page:'home',user:req.session.admin});
    } catch (error) {
        res.status(500).send();
    }
});

//products
router.get('/products',logauth, (req, res) => {
    try {
        res.render('admin/index',{page:'view_products',user:req.session.admin});
    } catch (error) {
        res.status(500).send();
    }
});
//login 
router.get('/login',auth,(req,res)=>{
    try {
        res.render('admin/login');
    } catch (error) {
        res.status(500).send();
    }
});
//logout 
router.get('/logout', logauth ,(req, res) => {
    try {
        req.session.destroy(err=>{
            if(err){
                return res.redirect('/admin/home');
            }

            res.clearCookie(process.env.SESSION_NAME);
            res.redirect('/');
        });
    } catch (error) {
        res.status(500).send();
    }
});
//register
router.get('/register',auth,(req,res)=>{
    try {
        res.render('admin/register');
    } catch (error) {
        res.status(500).send();
    }
});


//post -------------------------------------------------------------------------------------
//login admin
router.post('/login',auth,async(req, res) => {
    try {
        const {email,password} =req.body;
        let log_errors= [];
        if(!email || !password){
            log_errors.push({msg:'Please Fill all the fields'});
        }
        const user = await Admin.findOne({admin_email:email});
        if(!user && email && password){
            log_errors.push({msg:'Email or Password is wrong'});
        }else{
            const match = await  bcrypt.compare(password,user.admin_password);
            if(!match){
                log_errors.push({msg:'Email or password is wrong'});
            }
        }
        if(log_errors.length > 0){
            return res.render('admin/login',{log_errors:log_errors});
        }else{
            req.session.admin = user;
            res.redirect('/admin/home');
        }
        
    } catch (error) {
        res.status(401).send();
    }
});

//register admin 
router.post('/register',auth,async(req,res)=>{
    try {
        const {email,name,phone,password,confirmPassword}= req.body;
        let reg_errors =[];
        if(!email || !password || !phone || !confirmPassword || !name){
            reg_errors.push({msg:'Please fill all the fields'})
        }
        if(confirmPassword !== password && email && phone && name){
            reg_errors.push({msg:'Password does not match'});
        }
        const user = await Admin.find({admin_email:email});
        if(user.length >0){
            reg_errors.push({msg:'Email id already exist'});
        }

        if(reg_errors.length > 0){
           return res.render('admin/register',{reg_errors:reg_errors});
        }else{
            const regAdmin = new Admin({
                admin_email:email,
                admin_password:password,
                admin_name:name,
                admin_phone:phone
            });
            await regAdmin.save();
            res.redirect('/');
             
        }
    } catch (error) {
        res.status(500).send();
    }
});


module.exports = router;

