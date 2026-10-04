import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);

  const isFavorite = isInWishlist(product._id || product.id);

  // Add product to cart
  const handleCartClick = async (e) => {
    e.preventDefault();
    setAdding(true);
    await addToCart(product._id || product.id);
    setAdding(false);
  };

  // Toggle wishlist favorite status
  const handleWishlistClick = (e) => {
    e.preventDefault();
    const id = product._id || product.id;
    if (isFavorite) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between group relative">
      {/* Wishlist Heart Icon */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 transition cursor-pointer"
        aria-label="Wishlist"
      >
        <FaHeart className={`text-lg transition ${isFavorite ? 'text-red-500' : 'text-gray-300'}`} />
      </button>

      {/* Product Image & Link */}
      <Link to={`/product-details/${product._id || product.id}`} className="block">
        <div className="overflow-hidden rounded-lg mb-3 aspect-square flex items-center justify-center bg-gray-50">
          <img
            src={product.imageCover}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
            loading="lazy"
          />
        </div>

        {/* Category */}
        <span className="text-xs font-semibold text-fresh-600 block mb-1 uppercase tracking-wider">
          {product.category?.name || 'Category'}
        </span>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 leading-snug">
          {product.title}
        </h3>

        {/* Price & Rating */}
        <div className="flex items-center justify-between mt-auto mb-3">
          <span className="text-sm font-bold text-gray-900">{product.price} EGP</span>
          <div className="flex items-center space-x-1 text-xs text-amber-500">
            <FaStar />
            <span className="text-gray-600 font-medium">{product.ratingsAverage}</span>
          </div>
        </div>
      </Link>

      {/* Add To Cart Button */}
      <button
        onClick={handleCartClick}
        disabled={adding}
        className="w-full bg-fresh-600 hover:bg-fresh-700 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75"
      >
        {adding ? (
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ) : (
          <span>+ Add to Cart</span>
        )}
      </button>
    </div>
  );
}
