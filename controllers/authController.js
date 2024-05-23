import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import ordersModel from "../models/ordersModel.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

// --------registor controller-------

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, secretQuestion } = req.body;
    // validation
    if (!name) {
      return res.send({ message: "name is required" });
    }
    if (!email) {
      return res.send({ message: "email is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }
    if (!phone) {
      return res.send({ message: "phone no. is required" });
    }
    if (!address) {
      return res.send({ message: "address is required" });
    }
    if (!secretQuestion) {
      return res.send({ message: "secret question is required" });
    }

    // check existing user
    const existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "This email is Already register. Please login",
      });
    }

    // hashing password
    const hashedPassword = await hashPassword(password);
    // save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      secretQuestion,
      password: hashedPassword,
    }).save();
    // console.log(user);

    res.status(201).send({
      success: true,
      message: "User Register successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

// -------login controller-------

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // check user
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // match password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// -----------Forgot passeword controller---------------

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, secretQuestion, newPassword } = req.body;

    const user = await userModel.findOne({
      $and: [{ email }, { secretQuestion }],
    });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }

    // hash newPassword and update in database
    const newHashedPassword = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, {
      password: newHashedPassword,
    });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Some thing went wrong in controller",
      error,
    });
  }
};

// -------test controller-------

export const testController = async (req, res) => {
  res.send("protected route");
};

// ------Update Profile Controller---------

export const updateProfileController = async (req, res) => {
  try {
    const { name, phone, address, password } = req.body;
    const user = await userModel.findById(req.user._id);

    if (password && password.length < 6) {
      return res.json({ error: "password should 6 characters long" });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        phone: phone || user.phone,
        address: address || user.address,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in update profile controller",
      error,
    });
  }
};

// orders
export const getOrderController = async (req, res) => {
  try {
    const orders = await ordersModel
      .find({ buyer: req.user._id })
      .populate("products", "-image")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "orders fetch successfully",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in orders controller",
      error,
    });
  }
};

// All orders for admin
export const getAllOrderController = async (req, res) => {
  try {
    const orders = await ordersModel
      .find({})
      .populate("products", "-image")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "orders fetch successfully",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in orders controller",
      error,
    });
  }
};

// // order status update
export const updateOrderStatController = async (req, res) => {
  try {
    const { orderID } = req.params;
    const { status } = req.body;
    console.log(orderID, status);
    const order = await ordersModel.findByIdAndUpdate(
      orderID,
      { status },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Order Status updated successfully",
    });
    console.log(order);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in orders status update controller",
      error,
    });
  }
};
