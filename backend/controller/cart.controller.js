import Product from "../model/product.model.js";
import User from "../model/user.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    const exists = user.cartItem.find(
      (item) => item.product.toString() === productId,
    );

    if (exists) {
      exists.quantity += 1;
    } else {
      user.cartItem.push({ product: productId });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: user.cartItem,
    });
  } catch (error) {
    console.log("error in cartItem", error.message);

    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { id: productId } = req.body;
    const user = req.user;

    if (!productId) {
      user.cartItem = [];
    } else {
      user.cartItem = user.cartItem.filter(
        (item) => item.product.toString() !== productId,
      );
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "cart items deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const user = req.user;
    const { quantity } = req.body;

    const existingItem = user.cartItem.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      if (quantity === 0) {
        user.cartItem = user.cartItem.filter(
          (item) => item.product.toString() !== productId,
        );
        await user.save();
        return res.json({ success: true, data: user.cartItem });
      }
      existingItem.quantity = quantity;
      await user.save();
      return res.json({ success: true, data: user.cartItem });
    } else {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const productId = user.cartItem.map((item) => item.product);

    const products = await Product.find({ _id: { $in: productId } });

    const cartItems = products.map((product) => {
      const item = user.cartItem.find(
        (item) => item.product.toString() === product._id.toString(),
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });

    res.status(200).json({
      success: true,
      message: "cart items fetched successfully",
      data: cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
