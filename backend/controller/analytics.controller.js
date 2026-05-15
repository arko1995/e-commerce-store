import Order from "../model/order.model.js";
import Product from "../model/product.model.js";
import User from "../model/user.model.js";

export const getAnalyticsData = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const salesData = Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const [totalSales, totalRevenue] = salesData[0] || {
    totalRevenue: 0,
    totalSales: 0,
  };

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales: totalSales,
    totalRevenue: totalRevenue,
  };
};
