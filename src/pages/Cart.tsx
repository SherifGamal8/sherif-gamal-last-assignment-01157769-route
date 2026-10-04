import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag } from 'react-icons/fa';

export default function Cart() {
  const { cartDetails, loading, updateQuantity, removeItem, clearCart } = useCart();

  if (loading && !cartDetails) {
    return <Loader text="Loading your cart..." />;
  }

  const products = cartDetails?.products || [];

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaShoppingBag className="text-2xl" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 text-sm mb-6">Looks like you haven't added any products to your cart yet.</p>
        <Link
          to="/"
          className="inline-block bg-fresh-600 hover:bg-fresh-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-sm text-gray-500">
            Total Price: <span className="font-bold text-fresh-600">{cartDetails.totalCartPrice} EGP</span>
          </p>
        </div>
        <button
          onClick={clearCart}
          className="self-start sm:self-auto text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition cursor-pointer"
        >
          <FaTrash className="text-xs" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {products.map((item) => {
            const product = item.product;
            if (!product) return null;
            return (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Image & Title */}
                <div className="flex items-center space-x-4">
                  <img
                    src={product.imageCover}
                    alt={product.title}
                    className="w-20 h-20 object-contain rounded-lg bg-gray-50 border border-gray-100 p-1 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{product.category?.name}</p>
                    <p className="text-sm font-bold text-gray-900">{item.price} EGP</p>
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <button
                      onClick={() => updateQuantity(product._id || product.id, item.count - 1)}
                      className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-200 transition cursor-pointer"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="px-3 py-1 text-sm font-semibold text-gray-800 bg-white">
                      {item.count}
                    </span>
                    <button
                      onClick={() => updateQuantity(product._id || product.id, item.count + 1)}
                      className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-200 transition cursor-pointer"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(product._id || product.id)}
                    className="text-gray-400 hover:text-red-600 transition p-2 cursor-pointer"
                    title="Remove item"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Total Items</span>
              <span className="font-semibold">{products.reduce((acc, curr) => acc + curr.count, 0)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-fresh-600 font-semibold">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
              <span>Total Amount</span>
              <span className="text-fresh-600">{cartDetails.totalCartPrice} EGP</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="w-full bg-fresh-600 hover:bg-fresh-700 text-white py-3 rounded-xl font-medium transition text-center block"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
