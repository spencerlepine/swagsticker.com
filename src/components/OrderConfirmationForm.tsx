'use client';

import { useEffect, useState } from 'react';
import { loadStripe, PaymentIntent } from '@stripe/stripe-js';
import { notFound } from 'next/navigation';
import { useShoppingCart } from 'use-shopping-cart';
import Image from 'next/image';
import { CartItem } from '@/types';
import CartSummary from '@/components/CartSummary';

interface OrderConfirmationFormProps {
  cartItems: CartItem[];
  subtotal: string;
  shippingCost: string;
  orderSubtotal: string;
  email: string;
  address?: {
    city: string | null;
    country: string | null;
    line1: string | null;
    line2: string | null;
    postal_code: string | null;
    state: string | null;
  };
  shipping: {
    name?: string;
    phone?: string;
  };
}

export default function OrderConfirmationForm(props: OrderConfirmationFormProps) {
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
  const { clearCart } = useShoppingCart();

  useEffect(() => {
    fetch('/api/v1/checkout/config').then(async r => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // For payment intent retrieval
  const [isConfirming, setIsConfirming] = useState(false); // For order confirmation
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [orderId, setOrderId] = useState(null);

  // Retrieve payment intent once on mount
  useEffect(() => {
    if (!stripePromise) return;

    const retrievePaymentIntent = async () => {
      setIsLoading(true);
      try {
        const stripe = await stripePromise;
        const url = new URL(window.location.href);
        const clientSecret = url.searchParams.get('payment_intent_client_secret');
        if (!clientSecret) {
          throw new Error('Payment intent client secret not found in URL');
        }
        if (!stripe) {
          throw new Error('Stripe instance is null');
        }
        const { error, paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        if (error) {
          throw new Error(error?.message);
        }
        setPaymentIntent(paymentIntent);
      } catch (err) {
        setError(err as string);
      } finally {
        setIsLoading(false);
      }
    };

    retrievePaymentIntent();
  }, [stripePromise]);

  // Handle order confirmation
  const confirmOrder = async () => {
    if (!paymentIntent) {
      alert('Payment intent not loaded');
      return;
    }
    setIsConfirming(true);
    try {
      const response = await fetch('/api/v1/checkout/order-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setOrderId(data.orderId);
      setResult('success');
      clearCart();
    } catch (error) {
      console.error('Error confirming order:', error);
      setResult('error');
    } finally {
      setIsConfirming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return notFound();
  }

  // docs: https://docs.stripe.com/payments/paymentintents/lifecycle#intent-statuses
  // processing => requires_capture => succeeded
  if (paymentIntent && paymentIntent.status !== 'requires_capture') {
    return notFound();
  }

  if (result === 'success') {
    return (
      <div className="text-center my-14 max-w-md mx-auto">
        <Image width={100} height={100} src="/icons/check-mark.png" alt="Check Mark Icon" className="w-32 h-32 object-cover mx-auto mb-4" />
        <h2 className="text-green-700 font-bold text-xl">Thank you for your order!</h2>
        <p>We appreciate your business!</p>
        <p>A shipping number will be sent via email when ready.</p>
        <br />
        <p className="text-gray-600">
          If you have any questions, please email: <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}>{process.env.NEXT_PUBLIC_CONTACT_EMAIL}</a>.
        </p>
        <hr className="my-4"></hr>
        <p className="m-4 text-gray-400">Order ID: {orderId}</p>
        <a data-testid="view-orders-link" className="text-blue-500 border-2 border-blue-700 px-4 py-2 rounded-md" href="/account">
          View Orders
        </a>
      </div>
    );
  }

  if (result === 'error') {
    return (
      <div className="text-center my-14 max-w-md mx-auto">
        <Image width={100} height={100} src="/icons/failure-mark.png" alt="Check Mark Icon" className="w-32 h-32 object-cover mx-auto mb-4" />
        <h2 className="text-red-700 font-bold text-xl">ERROR</h2>
        <p>Thank you for your request. We are unable to process your order at this time.</p>
        <p>Please try again later</p>
        <hr className="my-4"></hr>
        <button onClick={confirmOrder} disabled={isConfirming} className="text-red-700 border-2 border-red-700 px-4 py-2 rounded-md">
          {isConfirming ? 'Processing...' : 'Try Again'}
        </button>
        <a className="text-blue-500 block m-2" href="/cart">
          Back
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Confirmation</h2>

      <div className="order-summary mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Shipping Information</h3>
            <div className="text-gray-600 space-y-1">
              {props.shipping.name && <p>{props.shipping.name}</p>}
              {props.address?.line1 && <p>{props.address.line1}</p>}
              {props.address?.line2 && <p>{props.address.line2}</p>}
              {(props.address?.city || props.address?.state || props.address?.postal_code) && (
                <p>{[props.address?.city, props.address?.state, props.address?.postal_code].filter(Boolean).join(', ')}</p>
              )}
              {props.address?.country && <p>{props.address.country}</p>}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
            <div className="text-gray-600 space-y-2">
              <p>Standard Shipping: Typically shipped within 2-5 business days</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
            <div className="text-gray-600 space-y-1">
              <p>Email: {props.email}</p>
              {props.shipping.phone && <p>Phone: {props.shipping.phone}</p>}
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">Note: You`ll receive a confirmation email with tracking information once your order ships.</p>
          </div>
        </div>
      </div>

      <div className="order-summary mb-8">
        <CartSummary {...props} />
      </div>

      <button
        data-testid="confirm-order-btn"
        onClick={confirmOrder}
        disabled={isConfirming}
        className={`
          w-full py-4 px-6 rounded-lg text-lg font-semibold
          bg-indigo-600 text-white
          hover:bg-indigo-700 
          disabled:bg-indigo-300 disabled:cursor-not-allowed
          transition-colors duration-200
          flex items-center justify-center
        `}
      >
        {isConfirming ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </>
        ) : (
          'Confirm & Pay'
        )}
      </button>

      <div className="mt-4 text-center">
        <a href="/cart" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
          Cancel
        </a>
      </div>
    </div>
  );
}
