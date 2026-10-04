import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FaShoppingCart, FaHeart, FaBars, FaTimes } from 'react-icons/fa';

import logo from '../assets/freshcart-logo.svg';

export default function Navbar() {
  const { userToken, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'text-fresh-600 font-semibold' : 'text-gray-600 hover:text-fresh-600'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="freshcart" className="h-8" />
          </Link>

          {/* Desktop Nav Links (if logged in) */}
          {userToken && (
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/products" className={navLinkClass}>Products</NavLink>
              <NavLink to="/categories" className={navLinkClass}>Categories</NavLink>
              <NavLink to="/brands" className={navLinkClass}>Brands</NavLink>
              <NavLink to="/allorders" className={navLinkClass}>Orders</NavLink>
            </div>
          )}

          {/* Right Side Icons & Auth */}
          <div className="hidden md:flex items-center space-x-5">
            {userToken ? (
              <>
                {/* Wishlist Link with Badge */}
                <Link to="/wishlist" className="relative text-gray-600 hover:text-red-500 transition">
                  <FaHeart className="text-xl" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* Cart Link with Badge */}
                <Link to="/cart" className="relative text-gray-600 hover:text-fresh-600 transition">
                  <FaShoppingCart className="text-xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-fresh-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-600 hover:text-red-600 transition cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-fresh-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-fresh-600 hover:bg-fresh-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {userToken && (
              <Link to="/cart" className="relative text-gray-600">
                <FaShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-fresh-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-2">
          {userToken ? (
            <>
              <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-fresh-600">Home</Link>
              <Link to="/products" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-fresh-600">Products</Link>
              <Link to="/categories" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-fresh-600">Categories</Link>
              <Link to="/brands" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-fresh-600">Brands</Link>
              <Link to="/wishlist" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-red-500">Wishlist ({wishlist.length})</Link>
              <Link to="/cart" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-fresh-600">Cart ({cartCount})</Link>
              <Link to="/allorders" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-fresh-600">Orders</Link>
              <button
                onClick={() => { setIsOpen(false); handleLogout(); }}
                className="w-full text-left py-2 text-red-600 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="pt-2 space-y-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center py-2 border border-gray-200 rounded-lg text-gray-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block text-center py-2 bg-fresh-600 text-white rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
