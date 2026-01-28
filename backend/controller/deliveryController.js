import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import HandleError from "../utils/handleError.js";
import handleAsyncError from '../middleware/handleAsyncError.js';

// Get all available (unassigned) orders for delivery boys to accept
export const getAvailableOrders = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find({ 
        $or: [
            { assignedTo: null },
            { assignedTo: { $exists: false } }
        ],
        orderStatus: { $nin: ['Delivered', 'Cancelled'] }
    }).populate("user", "name email");
    
    res.status(200).json({
        success: true,
        orders
    });
});

// Get orders assigned to the current delivery boy
export const getMyAssignedOrders = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find({ 
        assignedTo: req.user._id 
    }).populate("user", "name email");
    
    res.status(200).json({
        success: true,
        orders
    });
});

// Get all orders (read-only view for delivery boys)
export const getAllOrdersForDeliveryBoy = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find()
        .populate("user", "name email")
        .populate("assignedTo", "name email");
    
    res.status(200).json({
        success: true,
        orders
    });
});

// Delivery boy accepts/assigns an order to themselves
export const acceptOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new HandleError("Order not found", 404));
    }
    
    if (order.assignedTo) {
        return next(new HandleError("This order is already assigned to another delivery boy", 400));
    }
    
    if (order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled') {
        return next(new HandleError("Cannot accept a delivered or cancelled order", 400));
    }
    
    order.assignedTo = req.user._id;
    order.assignedAt = Date.now();
    await order.save({ validateBeforeSave: false });
    
    res.status(200).json({
        success: true,
        message: "Order accepted successfully",
        order
    });
});

// Delivery boy updates order status (Prepared, Shipped, Out for Delivery only)
export const updateDeliveryStatus = handleAsyncError(async (req, res, next) => {
    const { status } = req.body;
    const allowedStatuses = ['Prepared', 'Shipped', 'Out for Delivery'];
    
    if (!allowedStatuses.includes(status)) {
        return next(new HandleError(`Delivery boy can only update status to: ${allowedStatuses.join(', ')}`, 400));
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new HandleError("Order not found", 404));
    }
    
    if (!order.assignedTo || order.assignedTo.toString() !== req.user._id.toString()) {
        return next(new HandleError("You can only update orders assigned to you", 403));
    }
    
    if (order.orderStatus === 'Delivered') {
        return next(new HandleError("This order is already delivered", 400));
    }
    
    order.orderStatus = status;
    await order.save({ validateBeforeSave: false });
    
    res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        order
    });
});

// Delivery boy requests admin verification for completion
export const requestCompletion = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new HandleError("Order not found", 404));
    }
    
    if (!order.assignedTo || order.assignedTo.toString() !== req.user._id.toString()) {
        return next(new HandleError("You can only request completion for orders assigned to you", 403));
    }
    
    if (order.orderStatus === 'Delivered') {
        return next(new HandleError("This order is already delivered", 400));
    }
    
    if (order.completionRequested) {
        return next(new HandleError("Completion request already submitted", 400));
    }
    
    order.completionRequested = true;
    order.completionRequestedAt = Date.now();
    await order.save({ validateBeforeSave: false });
    
    res.status(200).json({
        success: true,
        message: "Completion request submitted. Waiting for admin confirmation.",
        order
    });
});

// Delivery boy adds a note to an order
export const addDeliveryNote = handleAsyncError(async (req, res, next) => {
    const { note } = req.body;
    
    if (!note) {
        return next(new HandleError("Note is required", 400));
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new HandleError("Order not found", 404));
    }
    
    if (!order.assignedTo || order.assignedTo.toString() !== req.user._id.toString()) {
        return next(new HandleError("You can only add notes to orders assigned to you", 403));
    }
    
    order.deliveryNotes.push({
        note,
        addedBy: req.user._id,
        addedAt: Date.now()
    });
    
    await order.save({ validateBeforeSave: false });
    
    res.status(200).json({
        success: true,
        message: "Delivery note added successfully",
        order
    });
});
