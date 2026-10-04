import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-8xl font-black text-gray-200">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">Page Not Found</h2>
      <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="inline-block bg-fresh-600 hover:bg-fresh-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
