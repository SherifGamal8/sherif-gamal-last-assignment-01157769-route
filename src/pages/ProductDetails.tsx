import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FaStar, FaHeart, FaArrowLeft } from 'react-icons/fa';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [adding, setAdding] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data.data);
        setActiveImage(data.data.imageCover);
      })
      .catch((err) => {
        console.error('Error fetching product details:', err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader text="Loading product details..." />;
  if (!product) return <div className="text-center py-20 text-gray-500">Product not found.</div>;

  const isFavorite = isInWishlist(product._id || product.id);

  const handleCartClick = async () => {
    setAdding(true);
    await addToCart(product._id || product.id);
    setAdding(false);
  };

  const handleWishlistClick = () => {
    const pId = product._id || product.id;
    if (isFavorite) {
      removeFromWishlist(pId);
    } else {
      addToWishlist(pId);
    }
  };

  return (
    <div>
      {/* Back Link */}
      <Link to="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-fresh-600 mb-6 transition">
        <FaArrowLeft className="mr-2" /> Back to Products
      </Link>

      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Gallery Section */}
        <div>
          <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center p-4 mb-4">
            <img
              src={activeImage || product.imageCover}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition p-1 bg-white flex-shrink-0 cursor-pointer ${
                    activeImage === img ? 'border-fresh-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-fresh-600 uppercase tracking-wider mb-2 block">
              {product.category?.name}
            </span>
            <button
              onClick={handleWishlistClick}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
              title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FaHeart className={`text-xl ${isFavorite ? 'text-red-500' : 'text-gray-300'}`} />
            </button>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>

          {/* Brand & Ratings */}
          <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
            {product.brand?.name && <span>Brand: <strong className="text-gray-700">{product.brand.name}</strong></span>}
            <div className="flex items-center space-x-1 text-amber-500">
              <FaStar />
              <span className="font-semibold text-gray-800">{product.ratingsAverage}</span>
              <span className="text-gray-400">({product.ratingsQuantity || 0} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="text-3xl font-extrabold text-gray-900 mb-6">
            {product.price} <span className="text-lg font-medium text-gray-500">EGP</span>
          </div>

          {/* Description */}
          <div className="mb-8 flex-grow">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 flex gap-4">
            <button
              onClick={handleCartClick}
              disabled={adding}
              className="flex-1 bg-fresh-600 hover:bg-fresh-700 text-white py-3 px-6 rounded-xl font-medium transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75"
            >
              {adding ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span>+ Add to Cart</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
