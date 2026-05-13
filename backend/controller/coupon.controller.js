import Coupon from "../model/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.find({ userId: req.user._id, isActive: true });
  } catch (error) {}
};
