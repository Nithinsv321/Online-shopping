const express = require('express');
const router = new express.Router();
require('../db/connection');
const mongoose = require('mongoose')
const session = require('express-session');
const bcrypt = require('bcryptjs');
const {userAuth} = require('../controllers/conrtoller');
const User = require('../models/user');
const Brand = require('../models/brand');
const Orders = require('../models/orders');
const Products =require('../models/products');
const Cart = require('../models/cart');
const userDetails = require('../models/userDetails');
const helper = require('../controllers/helper');
 
//get ---------------------------------------------
//homePage
router.get('/',async(req,res)=>{
    try {
        const products = await Products.find({});

        if(req.session.user){
            const cart = await Cart.find({user:req.session.user._id});
            return res.render('user/index',{page:'main',user:req.session.user,products,cart});
        }
        
        res.render('user/index',{page:'main',user:req.session.user,products});
        
    } catch (error) {
        console.log(error)
        res.status(500).send();
    }
});
//login
router.get('/login', (req, res) => {
    try {
        res.render('user/login');
    } catch (error) {
        res.status(500).send();
    }
});
//register
router.get('/register', (req, res) => {
    try {
        res.render('user/register');
    } catch (error) {
        res.status(500).send();
    }
});
//logout
router.get('/logout', (req, res) => {
    try {
        req.session.destroy(err=>{
            if(err){
                return res.redirect('/');
            }

            res.clearCookie(process.env.SESSION_NAME);
            res.redirect('/');
        });
    } catch (error) {
        res.status(500).send();
    }
});
//add-to-cart
router.get('/add_to_cart',userAuth,async(req,res)=>{
    try {
        const s = req.query.s;
        const d= req.query.d;
        if(s){
            const userCart = await Cart.findOne({user:req.session.user._id,product:s});
            if(!userCart){
                const addCart = await Cart({
                    user:req.session.user._id,
                    product:s,
                    quantity:1
                });
                await addCart.save();
                return res.redirect('/');
            }else{
                const updateCart = await Cart.findOneAndUpdate({product:s,user:req.session.user._id},{$inc:{quantity:1}});
                res.redirect('/');
            }
        }else if(d){
            const userCart = await Cart.findOne({user:req.session.user._id,product:d});
            if(!userCart){
                const addCart = await Cart({
                    user:req.session.user._id,
                    product:d,
                    quantity:1
                });
                await addCart.save();
                return res.redirect('/detail/'+d);
            }else{
                const updateCart = await Cart.findOneAndUpdate({product:s,user:req.session.user._id},{$inc:{quantity:1}});
                res.redirect('/detail/'+d);
            }
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).send();
    }
});
//shop
router.get('/shop',async(req,res)=>{
    try {
        const q= req.query.q;
        const g=req.query.g;
        const b=req.query.b;
        const brands = await Brand.find({});
        if(q){
            const products = await Products.find({type:q});
            if(req.session.user){
                const cart = await Cart.find({user:req.session.user._id});
                return res.render('user/index',{page:'shop',user:req.session.user,cart,products,brands});
            }
            res.render('user/index',{page:'shop',products,brands});
        }else if(g){
            const products = await Products.find({category:g});
            if(req.session.user){
                const cart = await Cart.find({user:req.session.user._id});
                return res.render('user/index',{page:'shop',user:req.session.user,cart,products,brands});
            }
            res.render('user/index',{page:'shop',products,brands});
        }else if(b){
            const products = await Products.find({brand:b});
            if(req.session.user){
                const cart = await Cart.find({user:req.session.user._id});
                return res.render('user/index',{page:'shop',cart,products,brands});
            }
            res.render('user/index',{page:'shop',products,brands});
        }else{
            const products = await Products.find({});
            if(req.session.user){
                const cart = await Cart.find({user:req.session.user._id});
                return res.render('user/index',{page:'shop',user:req.session.user,cart,products,brands});
            } 
            res.render('user/index',{page:'shop',products,brands});
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).send();
    }
});
//product detail
router.get('/detail/:id',async(req,res)=>{
    try {
        const id = req.params.id;
        const product = await Products.findById({_id:id});
        if(req.session.user){
            const cart = await Cart.find({user:req.session.user._id});
            return res.render('user/index',{page:'details',user:req.session.user,cart,product});
        }
        res.render('user/index',{page:'details',product})
    } catch (error) {
        console.log(error)
        res.status(500).send();
    }
});
//cart
router.get('/cart',userAuth, async(req, res) => {
    try {
        const cart = await Cart.find({user:req.session.user._id});
        const cartitem = await Cart.aggregate([
            {
                $match:{
                    user:{$in:[mongoose.Types.ObjectId(req.session.user._id),mongoose.Types.ObjectId(cart.user)]}
                }
            },
            {$lookup:{   
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'prodetails'
            }}
        ]);
        
        res.render('user/index',{page:'cart',user:req.session.user,cart,cartitem});
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});
//cart remove 
router.get('/remove_item/:id',userAuth,async(req,res)=>{
    try{
        const id= req.params.id;
        const item = await Cart.findByIdAndDelete({_id:id});
        res.redirect('/cart');
    }catch(error){
        console.log(error);
        res.status(500).send();
    }
});
//order history
router.get('/orders',userAuth,async(req,res)=>{
    try{
        const cart = await Cart.find({user:req.session.user._id});
        const orders = await Orders.find({user:req.session.user._id});
        const orderitems = await Orders.aggregate([
            {
                $match:{
                    user:{$in:[mongoose.Types.ObjectId(req.session.user._id),mongoose.Types.ObjectId(orders.user)]}
                },
            },
            {$lookup:{   
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'prodetails'
            }}
        ]);
        return res.render('user/index',{page:'orders',user:req.session.user,cart,orderitems});
            
        
    }catch(e){
        console.log(e);
        res.status(500).send();
    }
});
//checkout
router.get('/checkout',userAuth,async(req,res)=>{
    try{
        const cart = await Cart.find({user:req.session.user._id});
        const id = req.query.g;
        const address = await userDetails.findOne({user:req.session.user._id});
        if(id){
            const cartitem = await Cart.aggregate([
                {
                    $match:{
                        user:{$in:[mongoose.Types.ObjectId(req.session.user._id),mongoose.Types.ObjectId(cart.user)]},
                        _id:{$in:[mongoose.Types.ObjectId(id),mongoose.Types.ObjectId(cart._id)]}
                    }
                },
                {$lookup:{   
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'prodetails'
                }}
            ]);
            return res.render('user/index',{page:'checkout',user:req.session.user,cart,cartitem,address});
        }else{
            const cartitem = await Cart.aggregate([
                {
                    $match:{
                        user:{$in:[mongoose.Types.ObjectId(req.session.user._id),mongoose.Types.ObjectId(cart.user)]}
                    }
                },
                {$lookup:{   
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'prodetails'
                }}
            ]);
            res.render('user/index',{page:'checkout',user:req.session.user,cart,cartitem,address});
        }
    }catch(e){
        console.log(e);
        res.status(500).send();
    }
});
//payment
router.get('/payment',userAuth,async(req,res)=>{
    try{
        const item = req.session.ordered;
        if(typeof item == 'string'){
            const order = await Orders.findById({_id:item});
            return res.render('payment/gateway',{order:order});
        }else{
            let orders = [];
            item.forEach(async(it,index)=>{
                const order = await Orders.findById({_id:it});
                orders.push(order);
                if(index == item.length-1){
                    return res.render('payment/gateway',{orders:orders});
                }
            });
        }
        
    }catch(error){
        console.log(error);
        res.status(500).send();
    }
});
//order
router.get('/buy/:id',userAuth,async(req,res)=>{
    try {
        const id= req.params.id;
        const item = await Products.findById({_id:id});
        res.render('user/index',{page:'buy',item});
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

//post--------------------------------
//login
router.post('/login',async(req, res) => {
    try {
        const {user_email,user_password} = req.body;
        let log_errors= [];
        if(!user_email || !user_password){
            log_errors.push({msg:'Please Fill all the fields'});
        }
        const user = await User.findOne({email:user_email});
        if(!user && user_email && user_password){
            log_errors.push({msg:'Email or Password is wrong'});
        }
        if(user){
            const match = await  bcrypt.compare(user_password,user.password);
            if(!match){
                log_errors.push({msg:'Email or password is wrong'});
            }
        }
        if(log_errors.length > 0){
            return res.render('user/login',{log_errors:log_errors});
        }else{
            req.session.user = user;
            res.redirect('/');
        }
    } catch (error) {
        console.log(error)
        res.status(401).send();
    }
});
//register
router.post('/register',async(req,res)=>{
    try {
        const {email,name,phone,password,confirmPassword}= req.body;
        let reg_errors =[];
        if(!email || !password || !phone || !confirmPassword || !name){
            reg_errors.push({msg:'Please fill all the fields'})
        }
        if(confirmPassword !== password && email && phone && name){
            reg_errors.push({msg:'Password does not match'});
        }
        const user = await User.find({email:email});
        if(user.length > 0){
            reg_errors.push({msg:'Email id already exist'});
        }

        if(reg_errors.length > 0){
           return res.render('user/register',{reg_errors:reg_errors});
        }else{
            const regUser = new User({
                email:email,
                password:password,
                name:name,
                phone:phone
            });
            await regUser.save();
            res.redirect('/login');
             
        }
    } catch (error) {
        res.status(500).send();
    }
});
//place order
router.post('/ship',userAuth,async(req,res)=>{
    try{
        const cart = await Cart.find({user:req.session.user._id});
        const userAddress = await userDetails.findOne({user:req.session.user._id});
        const cartitem = await Cart.aggregate([
            {
                $match:{
                    user:{$in:[mongoose.Types.ObjectId(req.session.user._id),mongoose.Types.ObjectId(cart.user)]}
                }
            },
            {$lookup:{   
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'prodetails'
            }}
        ]);
        const {name,email,address,country,state,zip,save_info,product,quantity,paymentMethod} = req.body;
        if(save_info == 'on'){
                const regAddress = new userDetails({
                    user:req.session.user._id,
                    name:name,
                    mailid:email,
                    address:{
                        houseName:address,
                        country:country,
                        state:state,
                        zip:zip,
                    }
                });
                await regAddress.save();
        }
        if(typeof product == 'string'){
            await helper.placeOrder(req.body,req.session.user).then(async(ordered)=>{
                if(paymentMethod == 'cod'){
                    res.redirect('/orders');
                }else{
                    req.session.ordered = ordered;
                    res.redirect('/payment');
                }
                
            }).catch(()=>{
                res.render('user/index',{page:'checkout',user:req.session.user,cart,cartitem,address:userAddress,msg:'Order failed please try again'});
            });
        }else{
            await helper.placeOrders(req.body).then(async(proqty)=>{
                await helper.bulkOrder(proqty,req.body,req.session.user).then((ordered)=>{
                    if(paymentMethod == 'cod'){
                        res.redirect('/orders');
                    }else{
                        req.session.ordered = ordered;
                        res.redirect('/payment');
                    }
                }).catch(()=>{
                    res.render('user/index',{page:'checkout',user:req.session.user,cart,cartitem,address:userAddress,msg:'Order failed please try again'});
                });
            }).catch(()=>{
                res.render('user/index',{page:'checkout',user:req.session.user,cart,cartitem,address:userAddress,msg:'Order failed please try again'});
            });
        }

    }catch(error){
        res.status(500).send();
    }
});
//payment
router.post('/payment',userAuth,async(req,res)=>{
    try {
        const item = req.session.ordered;
        if(typeof item == 'string'){
            const order = await Orders.findByIdAndUpdate({_id:item},{status:true});
            if(!order){
                return res.render('payment/gateway',{msg:'Please try again'});
            }
            return res.redirect('/orders');
        }else{
            let orders = [];
            item.forEach(async(it,index)=>{
                const order = await Orders.findByIdAndUpdate({_id:it},{status:true});
                orders.push(order);
                if(!order){
                    return res.render('payment/gateway',{msg:'Please try again'});
                }
                if(index == item.length-1){
                    return res.redirect('/orders');
                }
            });
        }
    } catch (error) {
        res.status(500).send();
    }
});




module.exports = router;