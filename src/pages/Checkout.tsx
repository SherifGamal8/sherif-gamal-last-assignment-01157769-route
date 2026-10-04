import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cartId, cartDetails, getCart } = useCart();
  const [loadingCash, setLoadingCash] = useState(false);
  const [loadingOnline, setLoadingOnline] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    details: Yup.string().required('Shipping address details are required'),
    phone: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, 'Must be a valid Egyptian phone number (e.g. 01012345678)')
      .required('Phone number is required'),
    city: Yup.string().required('City is required'),
  });

  const formik = useFormik({
    initialValues: {
      details: '',
      phone: '',
      city: '',
    },
    validationSchema,
    onSubmit: () => {},
  });

  // 1. Cash on Delivery
  const handleCashOrder = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched({ details: true, phone: true, city: true });
      return;
    }

    if (!cartId) {
      toast.error('Cart is empty or not found');
      return;
    }

    setLoadingCash(true);
    try {
      const { data } = await api.post(`/orders/${cartId}`, {
        shippingAddress: formik.values,
      });
      if (data.status === 'success') {
        toast.success('Order placed successfully (Cash on Delivery)');
        getCart();
        navigate('/allorders');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place cash order');
    } finally {
      setLoadingCash(false);
    }
  };

  // 2. Online Payment (Stripe Checkout Session)
  const handleOnlinePayment = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched({ details: true, phone: true, city: true });
      return;
    }

    if (!cartId) {
      toast.error('Cart is empty or not found');
      return;
    }

    setLoadingOnline(true);
    try {
      const returnUrl = window.location.origin;
      const { data } = await api.post(
        `/orders/checkout-session/${cartId}?url=${returnUrl}`,
        { shippingAddress: formik.values }
      );
      if (data.status === 'success' && data.session?.url) {
        window.location.href = data.session.url;
      } else {
        toast.error('Could not generate online payment session');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment session failed');
    } finally {
      setLoadingOnline(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-sm text-gray-500 mb-6">
          Order Total:{' '}
          <span className="font-bold text-fresh-600">
            {cartDetails?.totalCartPrice || 0} EGP
          </span>
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              placeholder="e.g. Cairo, Giza, Alexandria"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-fresh-600"
            />
            {formik.touched.city && formik.errors.city && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.city}</p>
            )}
          </div>

          {/* Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Details</label>
            <textarea
              name="details"
              rows={3}
              placeholder="Street name, building number, apartment..."
              value={formik.values.details}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-fresh-600"
            />
            {formik.touched.details && formik.errors.details && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.details}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="01012345678"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-fresh-600"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.phone}</p>
            )}
          </div>

          {/* Payment Actions */}
          <div className="pt-4 space-y-3">
            <button
              type="button"
              onClick={handleCashOrder}
              disabled={loadingCash || loadingOnline}
              className="w-full bg-fresh-600 hover:bg-fresh-700 text-white py-2.5 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50"
            >
              {loadingCash ? 'Processing Order...' : 'Pay with Cash on Delivery'}
            </button>

            <button
              type="button"
              onClick={handleOnlinePayment}
              disabled={loadingCash || loadingOnline}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50"
            >
              {loadingOnline ? 'Redirecting to Stripe...' : 'Pay Online (Credit Card / Stripe)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
