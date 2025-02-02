import React from "react";
import { useGetMyordersQuery } from "@/redux/features/orders/orderApi";
import { motion } from "framer-motion";

interface Order {
  _id: string;
  user: string;
  email: string;
  product: {
    _id: string;
    title: string;
    productImg: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;
  payment: string | null;
  deliveryStatus: "pending" | "shipped" | "delivered" | "revoked";
  createdAt: string;
  updatedAt: string;
}

const MyOrders = () => {
  const { data: orders, isLoading, isError } = useGetMyordersQuery("");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // ✅ Handle API errors properly
  if (isError) {
    return (
      <div className="text-center text-lg font-semibold text-red-600">
        Something went wrong! Please try again later.
      </div>
    );
  }

  // ✅ Correctly handle empty orders case
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center text-lg font-semibold text-gray-600">
        You have no orders yet.
      </div>
    );
  }

  return (
    <div className="p-4 w-full max-w-4xl mx-auto">
      {orders.map((order: Order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Waiting for Shipping";
      case "shipped":
        return "Order has been shipped";
      case "delivered":
        return "Order delivered";
      case "revoked":
        return "Order has been cancelled";
      default:
        return "Unknown Status";
    }
  };

  const progressMap: { [key: string]: number } = {
    pending: 25,
    shipped: 50,
    delivered: 100,
    revoked: 0,
  };

  const statusIndex = ["pending", "shipped", "delivered"].indexOf(
    order.deliveryStatus
  );
  const progress = progressMap[order.deliveryStatus] || 0;

  return (
    <div className="shadow-md rounded-xl p-4 mb-4 w-full border border-gray-200 relative">
      <p className="font-bold text-lg mb-2 text-gray-900">
        {getStatusText(order.deliveryStatus)}
      </p>
      <div className="flex flex-col md:flex-row items-start gap-4">
        <img
          src={order.product.productImg}
          alt={order.product.title}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h2 className="text-md font-semibold">{order.product.title}</h2>
          <p className="text-gray-600">Quantity: {order.quantity}</p>
          <p className="text-gray-600">Total: €{order.totalPrice}</p>
          <p className="text-sm text-gray-500">
            Order Date: {new Date(order.createdAt).toDateString()}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 relative w-full">
        <div className="w-full h-1 bg-gray-300 rounded-full absolute top-2 left-0" />
        <motion.div
          className="h-1 rounded-full absolute top-2 left-0 bg-primary"
          initial={{ width: "20%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        <div className="flex items-center justify-between w-full relative z-10">
          {["pending", "shipped", "delivered"].map((_, index) => (
            <motion.div
              key={index}
              className={`h-5 w-5 rounded-full flex items-center justify-center ${
                index <= statusIndex ? "bg-primary-active" : "bg-gray-300"
              } ${
                index === statusIndex
                  ? "scale-100 shadow-md shadow-yellow-100"
                  : ""
              }`}
              animate={{
                scale: index === statusIndex ? 1.5 : 1.2,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        <div className="flex justify-between text-xs mt-2 text-gray-500">
          <span>Order Placed</span>
          <span>Shipped</span>
          <span>Delivered</span>
        </div>
      </div>

      <button className="w-full cursor-pointer md:w-auto mt-4 md:mt-0 md:absolute md:top-6 md:right-4 bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600">
        Cancel Order
      </button>
    </div>
  );
};

export default MyOrders;
