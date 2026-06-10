import { useEffect } from "react";
import { Package, Clock, CheckCircle, ShoppingBag, Store } from "lucide-react";
import { Link } from "react-router";
import { useOrderStore } from "../store/useOrderStore";

function OrdersProfile() {
  const { getProfileOrders, isFetchingOrders, orders, error } = useOrderStore();

  useEffect(() => {
    getProfileOrders();
  }, [getProfileOrders]);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "SHIPPED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "COMPLETED":
      case "DELIVERED":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (isFetchingOrders) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-center font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 mb-16 px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order History</h1>
          <p className="text-gray-500 font-medium mt-1">Track and review your past purchases</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center text-center bg-white rounded-3xl border border-gray-200 shadow-sm">
          <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900">No orders yet</h2>
          <p className="text-gray-500 mt-2 max-w-md">
            Looks like you haven't made any purchases. Start exploring shops to find something you love!
          </p>
          <Link
            to="/"
            className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden drop-shadow-sm hover:drop-shadow-md transition-shadow"
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Ordered from
                  </span>
                  <span className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                    <Store className="text-orange-600" />
                    <Link to={`/shop/${order.shop.name}`}>{order.shop.name}</Link>
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Date placed
                    </span>
                    <span className="text-gray-900 font-medium flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`px-4 py-1.5 rounded-full border font-bold text-sm flex items-center gap-1.5 ${getStatusColor(order.status)}`}
                  >
                    {order.status === "COMPLETED" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Package className="w-4 h-4" />
                    )}
                    {order.status}
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4">
                {order.orderItems.map((orderItem) => (
                  <div key={orderItem.id} className="flex gap-4 items-center">
                    <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                      {orderItem.item?.image ? (
                        <img
                          src={orderItem.item.image}
                          alt={orderItem.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                        {orderItem.productName}
                      </h3>
                      <p className="text-gray-500 font-medium mt-1">Qty: {orderItem.quantity}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">
                        ₱{Number(orderItem.priceAtTime).toLocaleString()}
                        <span className="text-black"> x {orderItem.quantity}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-500">
                  Order ID: <span className="font-mono text-gray-400">{order.id}</span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-600">Order Total:</span>
                  <span className="text-2xl font-black text-gray-900">
                    ₱{Number(order.totalAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersProfile;
