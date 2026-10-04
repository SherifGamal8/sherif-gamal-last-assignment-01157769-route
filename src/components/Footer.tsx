import { FaAmazonPay, FaCcMastercard, FaCcPaypal, FaApple, FaGooglePlay } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Get the FreshCart app</h3>
          <p className="text-sm text-gray-500 mb-4">We will send you a link, open it on your phone to download the app.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Email .."
              className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-fresh-600"
            />
            <button className="bg-fresh-600 hover:bg-fresh-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition cursor-pointer">
              Share App Link
            </button>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            <span>Payment Partners</span>
            <FaAmazonPay className="text-2xl text-gray-600" />
            <FaCcMastercard className="text-2xl text-gray-600" />
            <FaCcPaypal className="text-2xl text-gray-600" />
          </div>

          <div className="flex items-center space-x-3">
            <span>Get deliveries with FreshCart</span>
            <div className="flex items-center space-x-1 bg-gray-900 text-white px-3 py-1 rounded text-xs">
              <FaApple className="text-base" />
              <span>App Store</span>
            </div>
            <div className="flex items-center space-x-1 bg-gray-900 text-white px-3 py-1 rounded text-xs">
              <FaGooglePlay className="text-base" />
              <span>Google Play</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} FreshCart. All rights reserved. Route Academy Assignment.
        </div>
      </div>
    </footer>
  );
}
