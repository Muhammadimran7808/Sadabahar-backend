import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrderController,
  getAllOrderController,
  updateOrderStatController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
// roter object
const router = express.Router();

// ----------Routing---------

// REGISTER || METHOD POST
router.post("/register", registerController);

// LOGIN || METHOD POST
router.post("/login", loginController);

// Forgot password || Method POST
router.post("/forgot-password", forgotPasswordController);

// test route
router.get("/test", requireSignIn, isAdmin, testController);

// protected User route auth || method GET
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// Protected Admin Route auth || method GET
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// update profile
router.put("/update-profile", requireSignIn, updateProfileController);

// orders
router.get("/orders", requireSignIn, getOrderController);

// all orders for admin pannel
router.get("/all-orders", requireSignIn, isAdmin, getAllOrderController);

// order status update
router.put(
  "/update-status/:orderID",
  requireSignIn,
  isAdmin,
  updateOrderStatController
);

export default router;
