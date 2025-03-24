'use client';

import { useEffect, useState } from 'react';
import { loadStripe, PaymentIntent } from '@stripe/stripe-js';
import { notFound } from 'next/navigation';
import { useShoppingCart } from 'use-shopping-cart';
import Image from 'next/image';
import { SwagCartItem } from '@/types';
import CartSummary from '@/components/CartSummary';
import OrderConfirmationLoading from '@/app/order-confirmation/loading';

interface OrderConfirmationFormProps {
  cartItems: SwagCartItem[];
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
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (!stripePromise) return;

    const retrievePaymentIntent = async () => {
      setIsLoading(true);
      try {
        const stripe = await stripePromise;
        const url = new URL(window.location.href);
        const clientSecret = url.searchParams.get('payment_intent_client_secret');
        if (!clientSecret || !stripe) throw new Error('Invalid payment intent');
        const { error, paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        if (error) throw new Error(error.message);
        setPaymentIntent(paymentIntent);
      } catch (err) {
        setError(err as string);
      } finally {
        setIsLoading(false);
      }
    };

    retrievePaymentIntent();
  }, [stripePromise]);

  const confirmOrder = async () => {
    if (!paymentIntent) {
      alert('Payment intent not loaded');
      return;
    }
    setIsConfirming(true);
    try {
      const response = await fetch('/api/v1/checkout/order-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setOrderId(data.swagOrderId);
      setResult('success');
      clearCart();
    } catch (error) {
      console.error('Error confirming order:', error);
      setResult('error');
    } finally {
      setIsConfirming(false);
    }
  };

  if (isLoading) return <OrderConfirmationLoading />;
  if (error || (paymentIntent && paymentIntent.status !== 'requires_capture')) return notFound();

  return (
    <div className="min-h-[600px] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        {result === 'success' ? (
          <div className="text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <Image src="/icons/check-mark.png" alt="Check Mark" fill className="object-contain" />
            </div>
            <h2 className="text-xl font-semibold text-green-700">Order Confirmed!</h2>
            <p className="text-sm text-gray-600">Thank you! A shipping confirmation will be emailed soon.</p>
            <p data-testid="confirmation-order-id" className="text-xs text-gray-500">
              Order ID: {orderId}
            </p>
            <a
              data-testid="view-orders-link"
              href="/account"
              className="inline-block w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              View Orders
            </a>
          </div>
        ) : result === 'error' ? (
          <div className="text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <Image src="/icons/failure-mark.png" alt="Failure Icon" fill className="object-contain" />
            </div>
            <h2 className="text-xl font-semibold text-red-700">Order Failed</h2>
            <p className="text-sm text-gray-600">Please try again later.</p>
            <button
              onClick={confirmOrder}
              disabled={isConfirming}
              className="w-full py-2 px-4 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500">
              {isConfirming ? 'Processing...' : 'Retry'}
            </button>
            <a href="/cart" className="block text-indigo-600 hover:text-indigo-800 text-sm transition-colors duration-200">
              Return to Cart
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Confirm Your Order</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Shipping To</h3>
                <p className="text-sm text-gray-600">
                  {props.shipping.name && `${props.shipping.name}, `}
                  {props.address?.line1 && `${props.address.line1}, `}
                  {props.address?.line2 && `${props.address.line2}, `}
                  {[props.address?.city, props.address?.state, props.address?.postal_code].filter(Boolean).join(', ')}
                  {props.address?.country && `, ${props.address.country}`}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Contact</h3>
                <p className="text-sm text-gray-600">{props.email}</p>
                {props.shipping.phone && <p className="text-sm text-gray-600">{props.shipping.phone}</p>}
              </div>
              <CartSummary {...props} />
            </div>
            <button
              data-testid="confirm-order-btn"
              onClick={confirmOrder}
              disabled={isConfirming}
              className="w-full py-3 px-4 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:bg-green-300 transition-colors duration-200 flex items-center justify-center">
              {isConfirming ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
            <div className="text-center">
              <a href="/cart" className="text-indigo-600 hover:text-indigo-800 text-sm transition-colors duration-200">
                Edit Cart
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
