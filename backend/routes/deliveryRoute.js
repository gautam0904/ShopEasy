import express from "express";
import { 
    acceptOrder, 
    addDeliveryNote, 
    getAllOrdersForDeliveryBoy, 
    getAvailableOrders, 
    getMyAssignedOrders, 
    requestCompletion, 
    updateDeliveryStatus 
} from "../controller/deliveryController.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.route("/delivery/orders/available").get(verifyUserAuth, roleBasedAccess("deliveryboy"), getAvailableOrders);
router.route("/delivery/orders/mine").get(verifyUserAuth, roleBasedAccess("deliveryboy"), getMyAssignedOrders);
router.route("/delivery/orders/all").get(verifyUserAuth, roleBasedAccess("deliveryboy"), getAllOrdersForDeliveryBoy);

router.route("/delivery/order/:id/accept").put(verifyUserAuth, roleBasedAccess("deliveryboy"), acceptOrder);
router.route("/delivery/order/:id/status").put(verifyUserAuth, roleBasedAccess("deliveryboy"), updateDeliveryStatus);
router.route("/delivery/order/:id/request-completion").put(verifyUserAuth, roleBasedAccess("deliveryboy"), requestCompletion);
router.route("/delivery/order/:id/note").put(verifyUserAuth, roleBasedAccess("deliveryboy"), addDeliveryNote);

export default router;
