import asyncHandler from "../middlewares/asyncHandler"; 
import Product from "../models/productModel";

const addProduct=asyncHandler(async(req,res)=>{
    res.send('hello')
})
export {addProduct}