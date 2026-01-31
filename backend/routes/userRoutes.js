import express from 'express';
import {blockUser, deleteUser, getSingleUser, getUserDetails, getUsersList, loginUser, logout, registerUser, requestPasswordReset, resetPassword, unblockUser, updatePassword, updateProfile, updateUserRole, saveAddress, deleteAddress} from '../controller/userController.js';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';
const router=express.Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(logout)
router.route("/password/forgot").post(requestPasswordReset)
router.route("/reset/:token").post(resetPassword);
router.route("/profile").get(verifyUserAuth, getUserDetails);
router.route("/password/update").put(verifyUserAuth, updatePassword);
router.route("/profile/update").put(verifyUserAuth, updateProfile);
router.route("/me/address/new").post(verifyUserAuth, saveAddress);
router.route("/me/address/:id").delete(verifyUserAuth, deleteAddress);
router.route("/admin/users").get(verifyUserAuth, roleBasedAccess('admin'), getUsersList);
router.route("/admin/user/:id")
.get(verifyUserAuth, roleBasedAccess('admin'), getSingleUser)
.put(verifyUserAuth, roleBasedAccess('admin'),updateUserRole)
.delete(verifyUserAuth, roleBasedAccess('admin'),deleteUser)

// Block/Unblock User Routes
router.route("/admin/user/:id/block").put(verifyUserAuth, roleBasedAccess('admin'), blockUser)
router.route("/admin/user/:id/unblock").put(verifyUserAuth, roleBasedAccess('admin'), unblockUser)

export default router;