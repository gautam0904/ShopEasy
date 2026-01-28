import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            required:true
        },
        phoneNo:{
            type:Number,
            required:true
        },
        latitude:{
            type:Number,
            required:true
        },
        longitude:{
            type:Number,
            required:true
        }
    },
    orderItems:[
        {
            name:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            image:{
                type:String,
                required:true
            },
            product:{
                type:mongoose.Schema.ObjectId,
                ref:'Product',
                required:true
            }
        }
    ],
    orderStatus:{
        type:String,
        required:true,
        default:"Processing"
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    paymentInfo:{
        id:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        }
    },
    paidAt:{
        type:Date,
        required:true
    },
    itemPrice:{
        type:Number,
        required:true,
        default:0
    },
    taxPrice:{
        type:Number,
        required:true,
        default:0 
    },
    shippingPrice:{
        type:Number,
        required:true,
        default:0
    },
    totalPrice:{
        type:Number,
        required:true,
        default:0
    },
    deliveredAt:Date,
    createdAt:{
       type:Date,
       default:Date.now 
    },
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    assignedAt: Date,
    deliveryNotes: [{
        note: String,
        addedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
        addedAt: { type: Date, default: Date.now }
    }],
    completionRequested: {
        type: Boolean,
        default: false
    },
    completionRequestedAt: Date
})

export default mongoose.model('Order',orderSchema)