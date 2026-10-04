import { useState, useEffect } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
import { Brand } from '../types';
import { FaTimes } from 'react-icons/fa';

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  useEffect(() => {
    api.get('/brands')
      .then(({ data }) => setBrands(data.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading brands..." />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Brands</h1>
        <p className="text-sm text-gray-500">Shop your favorite featured brands</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {brands.map((brand) => (
          <div
            key={brand._id || brand.id}
            onClick={() => setSelectedBrand(brand)}
            className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-fresh-600 transition text-center flex flex-col items-center justify-center group cursor-pointer"
          >
            <div className="h-24 w-full flex items-center justify-center mb-2">
              <img
                src={brand.image}
                alt={brand.name}
                className="max-h-full max-w-full object-contain group-hover:scale-110 transition duration-300"
              />
            </div>
            <h3 className="text-xs font-semibold text-gray-700">{brand.name}</h3>
          </div>
        ))}
      </div>

      {/* Brand Details Modal */}
      {selectedBrand && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedBrand(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h2 className="text-lg font-bold text-gray-800">Brand Details</h2>
              <button
                onClick={() => setSelectedBrand(null)}
                className="text-gray-400 hover:text-gray-600 transition p-1 cursor-pointer"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col items-center text-center">
              <div className="h-36 w-full flex items-center justify-center bg-gray-50 rounded-xl mb-4 p-4 border border-gray-100">
                <img
                  src={selectedBrand.image}
                  alt={selectedBrand.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-fresh-600 mb-1">{selectedBrand.name}</h3>
              <p className="text-sm text-gray-400 font-mono mb-6">{selectedBrand.slug}</p>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedBrand(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
