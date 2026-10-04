import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import { FaHeart, FaTrash } from 'react-icons/fa';

export default function Wishlist() {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (loading && wishlist.length === 0) {
    return <Loader text="Loading your wishlist..." />;
  }

  if (wishlist.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaHeart className="text-2xl" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h2>
        <p className="text-gray-500 text-sm mb-6">Explore products and save your favorite items here.</p>
        <Link
          to="/products"
          className="inline-block bg-fresh-600 hover:bg-fresh-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-sm text-gray-500">{wishlist.length} items saved</p>
      </div>

      <div className="space-y-4">
        {wishlist.map((product) => {
          const id = product._id || product.id;
          return (
            <div
              key={id}
              className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={product.imageCover}
                  alt={product.title}
                  className="w-20 h-20 object-contain rounded-lg bg-gray-50 border border-gray-100 p-1 flex-shrink-0"
                />
                <div>
                  <Link
                    to={`/product-details/${id}`}
                    className="font-semibold text-gray-800 text-sm hover:text-fresh-600 transition line-clamp-1 mb-1 block"
                  >
                    {product.title}
                  </Link>
                  <p className="text-xs text-gray-500 mb-2">{product.category?.name}</p>
                  <p className="text-sm font-bold text-fresh-600">{product.price} EGP</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 sm:pt-0">
                <button
                  onClick={() => addToCart(id)}
                  className="bg-fresh-600 hover:bg-fresh-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
                >
                  + Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(id)}
                  className="text-gray-400 hover:text-red-600 p-2 transition cursor-pointer"
                  title="Remove"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
