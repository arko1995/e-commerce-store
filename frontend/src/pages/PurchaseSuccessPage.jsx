import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import React from "react";
import Confetti from "react-confetti";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useEffect } from "react";
import { useState } from "react";
import axiosInstance from "../lib/axios";

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const { clearCart } = useCartStore();

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId) => {
      try {
        await axiosInstance.post("/payment/checkout-success", {
          sessionId,
        });

        clearCart();
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsProcessing(false);
      }
    };

    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id",
    );
    console.log(sessionId);

    if (sessionId) {
      handleCheckoutSuccess(sessionId);
    } else {
      setIsProcessing(false);
      setError("No session Id");
    }
  }, [clearCart]);

  if (isProcessing) return "...processing";
  if (error) return `Error ${error}`;

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <Confetti
        numberOfPieces={500}
        recycle={false}
        gravity={0.1}
        style={{ zIndex: 99 }}
        width={window.innerWidth}
        height={window.innerHeight}
      />

      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <CheckCircle />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2">
            Purchase Successful!
          </h1>

          <p className="text-gray-300 text-center mb-2">
            Thank you for your order {"we're"} processing it now
          </p>
          <p className="text-emerald-400 text-center text-sm mb-6">
            Check your email for order details and updates
          </p>

          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Order Number</span>
              <span className="text-sm font-semibold text-emerald-400">
                #12345
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Estimated Delivery</span>
              <span className="text-sm font-semibold text-emerald-400">
                3-5 Business Days
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold 
                py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <HandHeart className="mr-2" size={18} />
              Thanks for trusting us
            </button>
            <Link
              to={"/"}
              className="w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold 
                py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <ArrowRight className="ml-2" size={18} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
