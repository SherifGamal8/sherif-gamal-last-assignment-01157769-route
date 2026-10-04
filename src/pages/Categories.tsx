import { useState, useEffect } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
import { Category, Subcategory } from '../types';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => setCategories(data.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setSubLoading(true);
    const catId = category._id || category.id;
    api.get(`/categories/${catId}/subcategories`)
      .then(({ data }) => {
        setSubcategories(data.data || []);
      })
      .catch((err) => {
        console.error('Error fetching subcategories:', err);
        setSubcategories([]);
      })
      .finally(() => {
        setSubLoading(false);
      });
  };

  if (loading) return <Loader text="Loading categories..." />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Categories</h1>
        <p className="text-sm text-gray-500">Browse products by category</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {categories.map((cat) => {
          const isSelected = selectedCategory && (selectedCategory._id || selectedCategory.id) === (cat._id || cat.id);
          return (
            <div
              key={cat._id || cat.id}
              onClick={() => handleCategoryClick(cat)}
              className={`bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition text-center group cursor-pointer ${
                isSelected ? 'border-fresh-600 ring-2 ring-fresh-600' : 'border-gray-100'
              }`}
            >
              <div className="h-44 w-full bg-gray-50 overflow-hidden flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 text-sm">{cat.name}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subcategories Section */}
      {selectedCategory && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-fresh-600 text-center mb-6">
            {selectedCategory.name} subcategories
          </h2>

          {subLoading ? (
            <Loader text={`Loading ${selectedCategory.name} subcategories...`} />
          ) : subcategories.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl border border-gray-100 p-6">
              <p className="text-gray-500">No subcategories found for {selectedCategory.name}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {subcategories.map((sub) => (
                <div
                  key={sub._id || sub.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-fresh-600 transition text-center"
                >
                  <h3 className="font-semibold text-gray-800">{sub.name}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
