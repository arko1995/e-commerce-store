import Coupon from "../model/coupon.model.js";
import { stripe } from "../lib/stripe.js";
import dotenv from "dotenv";

dotenv.config();

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      res.status(400).json({
        success: false,
        message: "There is no item on products array",
      });
    }

    let totalAmount = 0;

    const lineItem = products.map((item) => {
      const amount = Math.round(item.price * 100); // stripe expects value in cents
      totalAmount += amount * item.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: amount,
        },
      };
    });

    let coupon = null;

    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });

      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100,
        );
      }
    }

    const session = stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItem,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase_success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase_cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],

      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
      },
    });
  } catch (error) {}

  const createStripeCoupon = async (discountPercentage) => {
    const coupon = await stripe.coupons.create({
      percent_off: discountPercentage,
      duration: "once",
    });

    return coupon.id;
  };
};
