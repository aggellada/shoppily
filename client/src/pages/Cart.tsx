import { useEffect } from "react";
import { useCartStore } from "../store/useCartStore";
import { Trash2, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router";
import CartQtyControl from "../components/CartQtyControl";

function Cart() {
  const { cart, getCart, deleteCartItem } = useCartStore();

  const navigate = useNavigate();

  useEffect(() => {
    getCart();
  }, [getCart]);

  if (!cart) {
    return (
      <div className="w-full min-h-[50vh] flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // console.log(cart);

  // 1. Empty State
  if (cart.items.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-gray-50 p-6 rounded-full mb-4">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  // 2. Calculate Order Total
  const cartTotal = cart.items.reduce((total: number, cartItem: any) => {
    return total + cartItem.item.price * cartItem.quantity;
  }, 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side: Cart Items List */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          {/* Desktop Headers (Hidden on Mobile) */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 rounded-2xl text-sm font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {/* Cart Items */}
          <div className="flex flex-col gap-4">
            {cart.items.map((cartItem: any) => {
              const itemTotalPrice = cartItem.item.price * cartItem.quantity;

              return (
                <div
                  key={cartItem.id}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 md:px-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/shop/${cartItem.shopId}/${cartItem.itemId}`)}
                >
                  {/* Product Info */}
                  <div className="col-span-1 md:col-span-6 flex gap-4 items-center">
                    <img
                      src="https://www.shutterstock.com/image-photo/cosmetic-cream-tubes-hands-set-260nw-2406148543.jpg"
                      alt={cartItem.item.name}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl border border-gray-100"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold text-gray-900 text-lg">{cartItem.item.name}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCartItem(cartItem.item.shopId, cartItem.item.id);
                        }}
                        className="text-red-500 text-sm font-medium hover:text-red-600 flex items-center gap-1 mt-1 md:opacity-0 group-hover:opacity-100 transition-opacity w-fit"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Unit Price (Hidden on mobile to save space, shown on desktop) */}
                  <div className="hidden md:block col-span-2 text-center font-medium text-gray-500">
                    ₱{cartItem.item.price.toLocaleString()}
                  </div>

                  {/* Quantity Controls */}
                  <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center w-full mt-4 md:mt-0">
                    {/* Mobile label */}
                    <span className="md:hidden font-medium text-gray-500">Quantity:</span>

                    <CartQtyControl
                      shopId={cartItem.item.shopId}
                      itemId={cartItem.item.id}
                      itemQty={cartItem.quantity}
                    />
                  </div>

                  {/* Total Price per Item */}
                  <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center w-full mt-2 md:mt-0">
                    <span className="md:hidden font-medium text-gray-500">Total:</span>
                    <span className="font-bold text-gray-900 text-lg">
                      ₱{itemTotalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Order Summary Bento Box */}
        <div className="w-full lg:w-1/3 bg-gray-50 border border-gray-200 rounded-3xl p-6 lg:p-8 sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

          <div className="flex flex-col gap-4 text-gray-600 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₱{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-gray-400 italic">Calculated at checkout</span>
            </div>
            <div className="h-px bg-gray-200 w-full my-2"></div>
            <div className="flex justify-between text-lg">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-extrabold text-gray-900">₱{cartTotal.toLocaleString()}</span>
            </div>
          </div>

          <button className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 hover:shadow-lg transition-all active:scale-[0.98]">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
