import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Send verification code to email
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgotPasswords', { email });
      if (data.statusMsg === 'success' || data.message) {
        toast.success(data.message || 'Reset code sent to your email');
        setStep(2);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify reset code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!resetCode) return toast.error('Please enter the 6-digit code');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verifyResetCode', { resetCode });
      if (data.status === 'Success' || data.status === 'success') {
        toast.success('Code verified successfully');
        setStep(3);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired reset code');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const { data } = await api.put('/auth/resetPassword', {
        email,
        newPassword,
      });
      if (data.token) {
        toast.success('Password updated successfully! Please login.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-14">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              Enter your account's verified email address to receive a verification reset code.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-fresh-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-fresh-600 hover:bg-fresh-700 text-white py-2.5 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Sending code...' : 'Send Reset Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              Enter the reset code sent to <strong className="text-gray-700">{email}</strong>.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reset Code</label>
              <input
                type="text"
                required
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-fresh-600 text-center tracking-widest text-lg font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-fresh-600 hover:bg-fresh-700 text-white py-2.5 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              Please enter your new password.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-fresh-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-fresh-600 hover:bg-fresh-700 text-white py-2.5 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-fresh-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
