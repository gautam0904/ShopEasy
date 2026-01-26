import express from 'express';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';
import { allMyOrders, assignOrderToDeliveryBoy, confirmDelivery, createNewOrder, deleteOrder, getAllOrders, getOrdersPendingCompletion, getSingleOrder, updateOrderStatus } from '../controller/orderController.js';
import { acceptOrder, addDeliveryNote, getAllOrdersForDeliveryBoy, getAvailableOrders, getMyAssignedOrders, requestCompletion, updateDeliveryStatus } from '../controller/deliveryController.js';
const router=express.Router();

router.route('/new/order').post(verifyUserAuth,createNewOrder)
router.route('/order/:id')
.get(verifyUserAuth, getSingleOrder)
router.route('/admin/order/:id')
.put(verifyUserAuth,roleBasedAccess('admin'),updateOrderStatus)
.delete(verifyUserAuth,roleBasedAccess('admin'),deleteOrder)
router.route('/admin/orders').get(verifyUserAuth,roleBasedAccess('admin'), getAllOrders)
router.route('/orders/user').get(verifyUserAuth, allMyOrders)

// Admin - Confirm delivery and pending completions
router.route('/admin/order/:id/confirm-delivery').put(verifyUserAuth, roleBasedAccess('admin'), confirmDelivery)
router.route('/admin/orders/pending-completion').get(verifyUserAuth, roleBasedAccess('admin'), getOrdersPendingCompletion)
router.route('/admin/order/:id/assign').put(verifyUserAuth, roleBasedAccess('admin'), assignOrderToDeliveryBoy)

// Delivery Boy Routes
router.route('/delivery/orders/available').get(verifyUserAuth, roleBasedAccess('deliveryboy'), getAvailableOrders)
router.route('/delivery/orders/mine').get(verifyUserAuth, roleBasedAccess('deliveryboy'), getMyAssignedOrders)
router.route('/delivery/orders/all').get(verifyUserAuth, roleBasedAccess('deliveryboy'), getAllOrdersForDeliveryBoy)
router.route('/delivery/order/:id/accept').put(verifyUserAuth, roleBasedAccess('deliveryboy'), acceptOrder)
router.route('/delivery/order/:id/status').put(verifyUserAuth, roleBasedAccess('deliveryboy'), updateDeliveryStatus)
router.route('/delivery/order/:id/request-completion').put(verifyUserAuth, roleBasedAccess('deliveryboy'), requestCompletion)
router.route('/delivery/order/:id/note').post(verifyUserAuth, roleBasedAccess('deliveryboy'), addDeliveryNote)

export default router;