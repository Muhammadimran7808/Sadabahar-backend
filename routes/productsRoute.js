import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  getAllProductsController,
  getSingleProductController,
  productImageController,
  deleteProductController,
  updateProductController,
  productFilterController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductsController,
  categoryProductsController,
  braintreeTokenController,
  braintreePaymentController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

// create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// update product
router.put(
  "/update-product/:productid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// get all products
router.get("/get-products", getAllProductsController);

// get single products
router.get("/get-product/:pid", getSingleProductController);

// get product picture
router.get("/product-picture/:productid", productImageController);

//delete product
router.delete("/del-product/:productid", deleteProductController);

// filter product
router.post("/product-filter", productFilterController);

// products count
router.get("/products-count", productCountController);

// page per page
router.get("/products-list/:page", productListController);

// search product
router.get("/search/:keyword", searchProductController);

// Similar product
router.get("/related-products/:pid/:cid", relatedProductsController);

// Category wise Products
router.get("/category-products/:slug", categoryProductsController);

// ------------payment routes--------

// token
router.get("/braintree/token", braintreeTokenController);

// payments
router.post("/braintree/payment",requireSignIn, braintreePaymentController);

export default router;
