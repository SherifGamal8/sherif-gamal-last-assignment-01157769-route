import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirect to login if user is not authenticated
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { userToken, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-fresh-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not logged in -> redirect to login page
  if (!userToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
