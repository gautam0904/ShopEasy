import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import HandleError from "../utils/handleError.js";
import handleAsyncError from '../middleware/handleAsyncError.js';

// Create New Order
export const createNewOrder=handleAsyncError(async(req,res,next)=>{
const {shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice}=req.body;

  // Check for max quantity per item
  for (const item of orderItems) {
    if (item.quantity > 6) {
      return next(new HandleError("You can strictly order a maximum of 6 units for any single item", 400));
    }
  }

const order=await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt:Date.now(),
    user:req.user._id
})
res.status(201).json({
    success:true,
    order
})
})

//Getting single Order
export const getSingleOrder=handleAsyncError(async(req,res,next)=>{
 const order=await Order.findById(req.params.id).populate("user","name email")
 if(!order){
    return next(new HandleError("No order found",404));
 }
 res.status(200).json({
    success:true,
    order
 })
})

//All my orders
export const allMyOrders=handleAsyncError(async(req,res,next)=>{
 const orders=await Order.find({user:req.user._id});
 if(!orders){
    return next(new HandleError("No order found",404));
}
res.status(200).json({
    success:true,
    orders
})
})

//Getting all orders
export const getAllOrders=handleAsyncError(async(req,res,next)=>{
    const orders=await Order.find();
    let totalAmount=0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice
    })
    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })
})

//Update order status
export const updateOrderStatus=handleAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new HandleError("No order found",404));
    }
    if(order.orderStatus==='Delivered'){
        return next(new HandleError("This order is already been delivered",404));
    }
    await Promise.all(order.orderItems.map(item=>updateQuantity(item.product,item.quantity)
    ))
    order.orderStatus=req.body.status;
    if(order.orderStatus==='Delivered'){
        order.deliveredAt=Date.now();
    }
    await order.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
        order
    })
})
async function updateQuantity(id,quantity){
    const product=await Product.findById(id);
    if(!product){
        throw new Error("Product not found");
    }
    product.stock-=quantity
    await product.save({validateBeforeSave:false})
}

//Delete Order
export const deleteOrder=handleAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new HandleError("No order found",404));
    }
    if(order.orderStatus!=='Delivered'){
        return next(new HandleError("This order is under processing and cannot be deleted",404));

    }
    await Order.deleteOne({_id:req.params.id});
    res.status(200).json({
        success:true,
        message:"Order Deleted successfully"
    })
})

// Admin - Confirm Delivery (Mark as Delivered after delivery boy requests completion)
export const confirmDelivery=handleAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new HandleError("No order found",404));
    }
    if(order.orderStatus==='Delivered'){
        return next(new HandleError("This order is already delivered",400));
    }
    if(!order.completionRequested){
        return next(new HandleError("Delivery boy has not requested completion for this order",400));
    }
    
    // Update stock for each item
    await Promise.all(order.orderItems.map(item=>updateQuantity(item.product,item.quantity)))
    
    order.orderStatus='Delivered';
    order.deliveredAt=Date.now();
    order.completionRequested=false;
    await order.save({validateBeforeSave:false})
    
    res.status(200).json({
        success:true,
        message:"Order marked as delivered successfully",
        order
    })
})

// Admin - Get all orders pending completion (delivery boy has requested confirmation)
export const getOrdersPendingCompletion=handleAsyncError(async(req,res,next)=>{
    const orders=await Order.find({
        completionRequested: true,
        orderStatus: { $ne: 'Delivered' }
    }).populate("user","name email").populate("assignedTo","name email");
    
    res.status(200).json({
        success:true,
        orders
    })
})

// Admin - Assign order to delivery boy
export const assignOrderToDeliveryBoy=handleAsyncError(async(req,res,next)=>{
    const { deliveryBoyId } = req.body;
    const order=await Order.findById(req.params.id);
    
    if(!order){
        return next(new HandleError("No order found",404));
    }
    
    if(order.orderStatus==='Delivered'){
        return next(new HandleError("Cannot assign a delivered order",400));
    }
    
    const deliveryBoy = await User.findById(deliveryBoyId);
    if(!deliveryBoy || deliveryBoy.role !== 'deliveryboy'){
        return next(new HandleError("Invalid delivery boy",400));
    }
    
    order.assignedTo = deliveryBoyId;
    order.assignedAt = Date.now();
    await order.save({validateBeforeSave:false});
    
    res.status(200).json({
        success:true,
        message:"Order assigned to delivery boy successfully",
        order
    })
})