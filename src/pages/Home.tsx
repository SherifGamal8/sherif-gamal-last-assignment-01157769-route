import { useState, useEffect } from 'react';
import api from '../services/api';
import MainSlider from '../components/MainSlider';
import CategoriesSlider from '../components/CategoriesSlider';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { FaSearch } from 'react-icons/fa';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all products on mount
  useEffect(() => {
    api.get('/products')
      .then(({ data }) => {
        setProducts(data.data || []);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter products by search input
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Hero Sliders */}
      <MainSlider />
      <CategoriesSlider />

      {/* Products Section Header & Search */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <p className="text-sm text-gray-500">Explore our daily updated fresh catalog</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-fresh-600 focus:ring-1 focus:ring-fresh-600 transition"
          />
        </div>
      </div>

      {/* Product Grid or Loader */}
      {loading ? (
        <Loader text="Loading fresh products..." />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 p-8">
          <p className="text-gray-500 font-medium">No products found matching "{searchTerm}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
