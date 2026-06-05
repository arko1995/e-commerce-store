import Coupon from "../model/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "invalid coupon",
      });
    }

    res.status(200).json({
      success: true,
      message: "coupon fetched",
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({
      code: code,
      isActive: true,
      userId: req.user._id,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({
        success: false,
        message: "coupon expired",
      });
    }
    res.status(200).json({
      success: true,
      message: "Valid coupon",
      data: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        valid_till: coupon.expirationDate,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
