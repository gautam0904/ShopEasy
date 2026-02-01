import express from "express";
import { createContactMessage, getAllContactMessages, deleteContactMessage } from "../controller/contactController.js";
import { verifyUserAuth, roleBasedAccess } from "../middleware/userAuth.js";

const router = express.Router();

router.route("/contact").post(createContactMessage);

router
  .route("/admin/contacts")
  .get(verifyUserAuth, roleBasedAccess("admin"), getAllContactMessages);

router
  .route("/admin/contact/:id")
  .delete(verifyUserAuth, roleBasedAccess("admin"), deleteContactMessage);

export default router;
