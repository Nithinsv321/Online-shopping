const session = require('express-session');
require('../db/connection');
const mongoose = require('mongoose');
const User = require('../models/user');
const Brand = require('../models/brand');
const Orders = require('../models/orders');
const Products =require('../models/products');
const Cart = require('../models/cart');
const userDetails = require('../models/userDetails');
module.exports ={
    placeOrder:(order,user)=>{
        return new Promise(async(resolve,reject)=>{
            const newOrder = new Orders({
                user:user._id,
                product:order.product,
                quantity:order.quantity,
                details:{
                    name:order.name,
                    houseName:order.address,
                    zip:order.zip,
                    state:order.state,
                    country:order.country,
                },
                payment:order.paymentMethod,

            });
            const saved = await newOrder.save();
            const product = await Products.findById({_id:order.product});
            let quantity = product.quantity - order.quantity;
            const productUpdate = await Products.findByIdAndUpdate({_id:order.product},{quantity:quantity});
            const cart = await Cart.findOneAndDelete({product:order.product,user:user._id});
            if(saved && productUpdate && cart){
                resolve();
            }else{
                reject();
            }
        });
    },
    placeOrders:(orders)=>{
        return new Promise(async(resolve,reject)=>{
            let proqty =[];
            for(let i=0,j=0;i<orders.product.length,j<orders.quantity.length;i++,j++){
                proqty.push({
                    product:orders.product[i],
                    quantity:orders.quantity[j],
                });
            }
            resolve(proqty);
        });
        
    },
    bulkOrder:(proqty,order,user)=>{
        return new Promise(async(resolve,reject)=>{
            let f=0;
            proqty.forEach(async function(pro){
                const newOrder = new Orders({
                    user:user._id,
                    product:pro.product,
                    quantity:pro.quantity,
                    details:{
                        name:order.name,
                        houseName:order.address,
                        zip:order.zip,
                        state:order.state,
                        country:order.country,
                    },
                    payment:order.paymentMethod,
    
                });
                const saved = await newOrder.save();
                const product = await Products.findById({_id:pro.product});
                let quantity = product.quantity - pro.quantity;
                const productUpdate = await Products.findByIdAndUpdate({_id:pro.product},{quantity:quantity});
                const cart = await Cart.findOneAndDelete({product:pro.product,user:user._id});
                if(!saved && !productUpdate && !cart){
                    f++;
                }
            });
            if(f>0){
                reject();
            }else{
                resolve();
            }
        });
    }
}