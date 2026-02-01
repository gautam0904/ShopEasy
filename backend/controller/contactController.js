import Contact from "../models/contactModel.js";
import ErrorHandler from "../utils/handleError.js";
import catchAsyncErrors from "../middleware/handleAsyncError.js";
import { sendEmail } from "../utils/sendEmail.js";

export const createContactMessage = catchAsyncErrors(async (req, res, next) => {
  const { name, email, message } = req.body;

  const contact = await Contact.create({
    name,
    email,
    message,
  });

  try {
    await sendEmail({
      email: process.env.SMTP_MAIL,
      subject: `New Contact Message from ${name}`,
      message: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });
  } catch (error) {
    console.log("Email could not be sent", error);
  }

  res.status(201).json({
    success: true,
    message: "Message Sent Successfully",
    contact,
  });
});

// Get All Contact Messages (Admin)
export const getAllContactMessages = catchAsyncErrors(async (req, res, next) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    contacts,
  });
});

// Delete Contact Message (Admin)
export const deleteContactMessage = catchAsyncErrors(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorHandler("Contact message not found", 404));
  }

  await contact.deleteOne();

  res.status(200).json({
    success: true,
    message: "Contact message deleted successfully",
  });
});
