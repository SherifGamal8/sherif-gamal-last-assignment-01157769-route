import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaCheckCircle, FaClock } from 'react-icons/fa';

export default function AllOrders() {
  const { userData } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = userData?.id || userData?._id;
    if (userId) {
      api.get(`/orders/user/${userId}`)
        .then(({ data }) => {
          setOrders(data || []);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userData]);

  if (loading) return <Loader text="Loading your orders..." />;

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaBoxOpen className="text-2xl" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">No Orders Placed Yet</h2>
        <p className="text-gray-500 text-sm mb-6">You haven't placed any orders with FreshCart yet.</p>
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
        <p className="text-sm text-gray-500">Review your past orders and delivery status</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id || order.id}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 text-sm">
              <div>
                <span className="text-gray-500">Order ID: </span>
                <span className="font-mono font-bold text-gray-800">#{order.id || order._id}</span>
                <span className="text-gray-400 text-xs ml-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    order.isPaid
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.isPaid ? <FaCheckCircle /> : <FaClock />}
                  {order.isPaid ? 'Paid' : 'Payment Pending'}
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    order.isDelivered
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {order.isDelivered ? 'Delivered' : 'Processing'}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="py-4 divide-y divide-gray-100">
              {order.cartItems?.map((item) => (
                <div key={item._id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product?.imageCover}
                      alt={item.product?.title}
                      className="w-14 h-14 object-contain rounded bg-gray-50 border p-1"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm line-clamp-1">
                        {item.product?.title}
                      </h4>
                      <p className="text-xs text-gray-500">Qty: {item.count}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-gray-800">{item.price} EGP</span>
                </div>
              ))}
            </div>

            {/* Footer total */}
            <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
              <span className="text-gray-500">Total Order Amount</span>
              <span className="text-lg font-bold text-fresh-600">
                {order.totalOrderPrice} EGP
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
