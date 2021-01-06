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
                amount:order.amount,
                payment:order.paymentMethod,

            });
            const saved = await newOrder.save();

            const product = await Products.findById({_id:order.product});
            let quantity = product.quantity - order.quantity;
            const productUpdate = await Products.findByIdAndUpdate({_id:order.product},{quantity:quantity});
            const cart = await Cart.findOneAndDelete({product:order.product,user:user._id});
            if(saved && productUpdate && cart){
                resolve(saved._id);
            }else{
                reject();
            }
        });
    },
    placeOrders:(orders)=>{
        return new Promise(async(resolve,reject)=>{
            let proqty =[];
            
            for(let i=0;i<orders.product.length;i++){
                proqty.push({
                    product:orders.product[i],
                    quantity:orders.quantity[i],
                    amount:orders.amount[i],
                });
                if(i == orders.product.length-1){
                    resolve(proqty);
                }
            }
            
        });
        
    },
    bulkOrder:(proqty,order,user)=>{
        return new Promise(async(resolve,reject)=>{
            let f=0;
            let ordered = [];
            proqty.forEach(async function(pro,index){
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
                    amount:pro.amount,
                    payment:order.paymentMethod,
    
                });
                const saved = await newOrder.save();
                await ordered.push(saved._id);
                const product = await Products.findById({_id:pro.product});
                let quantity = product.quantity - pro.quantity;
                const productUpdate = await Products.findByIdAndUpdate({_id:pro.product},{quantity:quantity});
                const cart = await Cart.findOneAndDelete({product:pro.product,user:user._id});
                if(!saved && !productUpdate && !cart){
                    f++;
                }
                if(index == proqty.length - 1){
                    if(f>0){
                        reject();
                    }else{
                        resolve(ordered);
                    }
                }
            });
            
            
        });
    },
    paypass:()=>{
        return new Promise((resolve,reject)=>{

        });
    }
}