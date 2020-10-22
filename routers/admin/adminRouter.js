const {logauth,auth} = require('../../controllers/conrtoller');
const express = require('express');
require('../../db/connection');
const router = new express.Router();
const session = require('express-session');
const bcrypt = require('bcryptjs')
const Admin = require('../../models/admin');
const Product = require('../../models/products');
const Category = require('../../models/category');
const Brand = require('../../models/brand');
const { get } = require('mongoose');


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
//add-product
router.get('/add-product',logauth,async(req,res)=>{
    try {
        const brands = await Brand.find({admin:req.session.admin._id});
        const categorys = await Category.find({admin:req.session.admin._id});
        res.render('admin/index',{page:'add_product',user:req.session.admin,brands:brands,categorys:categorys});
    } catch (error) {
        res.status(500).send();
    }
});
//products
router.get('/products',logauth, async(req, res) => {
    try {
        const products = await Product.find({admin:req.session.admin._id});
        res.render('admin/index',{page:'view_products',user:req.session.admin,products:products});
    } catch (error) {
        res.status(500).send();
    }
});
//brand
router.get('/brand', logauth,async(req,res)=>{
    try {
        const brands = await Brand.find({admin:req.session.admin._id});
        res.render('admin/index',{page:'brand',user:req.session.admin,brands:brands});
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});
//category
router.get('/category', logauth,async(req,res)=>{
    try {
        const categorys = await Category.find({admin:req.session.admin._id});
        res.render('admin/index',{page:'category',user:req.session.admin,categorys:categorys});
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});
//update-stock-details
router.get('/update-stock', logauth,async(req, res) => {
    try {
        const brands = await Brand.find({admin:req.session.admin._id});
        res.render('admin/index',{page:'update_stock',user:req.session.admin,brands:brands});
    } catch (error) {
        res.status(500).send();
    }
});
//add-stock
router.get('/add-stock/:id', logauth,async(req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById({_id:id,admin:req.session.admin.id});
        res.render('admin/index',{page:'add_stock',product:product,user:req.session.admin})
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

//add-product
router.post('/add-product',logauth,async(req,res)=>{
    try {
        let add_product_errors =[];
        const {name,model,price,quantity}=req.body;
        const category = req.body.category;
        const brand = req.body.brand;
        const brands = await Brand.find({admin:req.session.admin._id});
        const categorys = await Category.find({admin:req.session.admin._id});
        if(!name || !model || !price || !quantity){
            add_product_errors.push({msg:"Please Enter all the products"});
        }
        if(category == '' && name && model && price && quantity){
            add_product_errors.push({msg:"Please Select Category"});
        }
        if(brand == '' && name && model && price && quantity){
            add_product_errors.push({msg:"Please Select Brand"});
        }
        const modelCheck = await Product.findOne({model:model,admin:req.session.admin._id});
        if(modelCheck){
            add_product_errors.push({msg:'Model Already Exist. Update the quantity'});
        }
        if(add_product_errors.length >0){
            return res.render('admin/index',{page:'add_product',user:req.session.admin,add_product_errors:add_product_errors,brands:brands,categorys:categorys});
        }else{
            const addProduct = new Product({
                admin:req.session.admin._id,
                name:name,
                model:model,
                price:price,
                quantity:quantity,
                category:category,
                brand:brand
            });
            await addProduct.save();
            res.redirect('/admin/add-product');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

//add-brand
router.post('/brand',logauth,async(req,res)=>{
    try {
        let add_brand_errors = [];
          const brand = req.body.brand.toUpperCase();
          const brands = await Brand.find({admin:req.session.admin._id});
          if(!brand){
            add_brand_errors.push({msg:'Please Enter Brand Name'});
          }
          const brandExist = await Brand.find({brand:brand,admin:req.session.admin._id});
          if(brandExist.length > 0 && brand){
            add_brand_errors.push({msg:'Brand Already Exist'});
          }

          if(add_brand_errors.length > 0){
            return res.render('admin/index',{page:'brand',user:req.session.admin,brands:brands,add_brand_errors:add_brand_errors});
          }else{
              const newBrand = new Brand({
                  admin:req.session.admin._id,
                  brand:brand
              });
              await newBrand.save();
              res.redirect('/admin/brand');
          }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

//add-category
router.post('/category',logauth,async(req,res)=>{
    try {
        let add_category_errors = [];
          const category = req.body.category.toUpperCase();
          const categorys = await Category.find({admin:req.session.admin._id});
          if(!category){
            add_category_errors.push({msg:'Please Enter Category Name'});
          }
          const categoryExist = await Category.find({category:category,admin:req.session.admin._id});
          if(categoryExist.length > 0 && category){
            add_category_errors.push({msg:'Category Already Exist'});
          }

          if(add_category_errors.length > 0){
            return res.render('admin/index',{page:'category',user:req.session.admin,categorys:categorys,add_category_errors:add_category_errors});
          }else{
              const newCategory = new Category({
                  admin:req.session.admin._id,
                  category:category
              });
              await newCategory.save();
              res.redirect('/admin/category');
          }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

//update-stock-details
router.post('/update-stock',logauth,async(req,res)=>{
    try {
        const brands = await Brand.find({admin:req.session.admin._id});
        const {brand,model} = req.body;
        let update_errors = [];
        if(!brand || !model){
            update_errors.push({msg:'Please fill all the fields'});
        }
        const product = await Product.findOne({brand:brand,model:model,admin:req.session.admin._id});
        if(!product && brand && model){
            update_errors.push({msg:'Items not found please check the Brand or Model'});
        }
        if(update_errors.length > 0){
            return res.render('admin/index',{page:'update_stock',user:req.session.admin,brands:brands,update_errors:update_errors});
        }else{
            res.render('admin/index',{page:'update_stock',user:req.session.admin,brands:brands,product:product});
        }
    } catch (error) {
        res.status(500).send();
    }
});

//add-stock
router.post('/add-stock/:id',logauth ,async(req, res) => {
    try {
        const {price,quantity} = req.body;
        const id = req.params.id;
        const product = await Product.findById({_id:id,admin:req.session.admin._id});
        let update_stock_errors=[];
        if(!price || !quantity){
            update_stock_errors.push({msg:'Please Fill all the Fields'});
        }
        if(update_stock_errors.length >0){
            return res.render('admin/index',{page:'add_stock',product:product,user:req.session.admin,update_stock_errors:update_stock_errors});
        }else{
            const updateQty = product.quantity + parseInt(quantity);
            await Product.findByIdAndUpdate({_id:id},{price:price,quantity:updateQty});
            res.redirect('/admin/update-stock');
        }
    } catch (error) {
        res.status(500).send();
    }
});


module.exports = router;

