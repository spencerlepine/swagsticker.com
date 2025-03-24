'use client';

import { PaymentElement, AddressElement, Elements } from '@stripe/react-stripe-js';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import CartSummary from './CartSummary';
import { loadStripe } from '@stripe/stripe-js';
import PaymentNotice from '@/components/PaymentNotice';
import { SwagCartItem } from '@/types';

const SkeletonBlock: React.FC<{ className?: string }> = ({ className = '' }) => <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;

function StripePaymentIframe() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if Stripe elements are ready
  const isStripeReady = stripe && elements;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
      });

      if (error) {
        setMessage(error.type === 'card_error' || error.type === 'validation_error' ? error.message ?? 'An error occurred.' : 'An unexpected error occurred.');
      }
    } catch (err) {
      console.error('Error confirming payment:', err);
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4" data-testid="shipping-address-title">
          Shipping Address
        </h3>
        <div className="min-h-[150px]">
          {isStripeReady ? (
            <AddressElement
              id="shipping-address-element"
              options={{
                mode: 'shipping',
                allowedCountries: ['US'],
                fields: { phone: 'always' },
                validation: { phone: { required: 'always' } },
              }}
            />
          ) : (
            <SkeletonBlock className="h-36 w-full" />
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
        {isStripeReady ? (
          <PaymentNotice />
        ) : (
          <div className="bg-gray-200 p-4 rounded-md mb-6 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-32" /> {/* "Test Payment Details" */}
                <SkeletonBlock className="h-4 w-48" /> {/* "Please use the following..." */}
                <SkeletonBlock className="h-4 w-36" /> {/* "Card: 4242..." */}
              </div>
              <SkeletonBlock className="h-4 w-4" /> {/* Close button */}
            </div>
          </div>
        )}
        <div className="min-h-[226px]">
          {isStripeReady ? <PaymentElement id="payment-element" options={{ business: { name: 'SwagSticker' } }} /> : <SkeletonBlock className="h-[226px] w-full" />}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
        {isStripeReady ? (
          <AddressElement
            id="billing-address-element"
            options={{
              mode: 'billing',
              allowedCountries: ['US'],
              fields: { phone: 'always' },
              validation: { phone: { required: 'always' } },
            }}
          />
        ) : (
          <SkeletonBlock className="h-36 w-full" />
        )}
      </div>

      <button
        data-testid="checkout-submit-paymentintent-btn"
        disabled={isLoading || !stripe || !elements}
        className={`
          w-full py-4 px-6 rounded-lg text-lg font-semibold
          bg-indigo-600 text-white
          hover:bg-indigo-700 
          disabled:bg-gray-400 disabled:cursor-not-allowed
          transition-colors duration-200
          flex items-center justify-center
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        `}
      >
        {isLoading ? (
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
          'Review'
        )}
      </button>

      {message && <div className="text-red-600 text-center p-4 bg-red-50 rounded-lg">{message}</div>}

      <div className="mt-4 text-center">
        <a href="/cart" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
          Cancel
        </a>
      </div>
    </form>
  );
}

interface CheckoutFormProps {
  cartItems: SwagCartItem[];
  subtotal: string;
  shippingCost: string;
  orderSubtotal: string;
  clientSecret?: string;
}

export default function CheckoutForm(props: CheckoutFormProps) {
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
  const [isStripeLoading, setIsStripeLoading] = useState(true);

  useEffect(() => {
    setIsStripeLoading(true);
    fetch('/api/v1/checkout/config')
      .then(async (r: Response) => {
        const { publishableKey } = await r.json();
        setStripePromise(loadStripe(publishableKey));
        setIsStripeLoading(false);
      })
      .catch(err => {
        console.error('Failed to load Stripe config:', err);
        setIsStripeLoading(false);
      });
  }, []);

  const renderSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <SkeletonBlock className="h-6 w-1/4 mb-4" />
        <SkeletonBlock className="h-36 w-full" />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <SkeletonBlock className="h-6 w-1/4 mb-4" />
        <div className="bg-gray-200 p-4 rounded-md mb-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-4 w-48" />
              <SkeletonBlock className="h-4 w-36" />
            </div>
            <SkeletonBlock className="h-4 w-4" />
          </div>
        </div>
        <SkeletonBlock className="h-24 w-full" />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <SkeletonBlock className="h-6 w-1/4 mb-4" />
        <SkeletonBlock className="h-36 w-full" />
      </div>
      <SkeletonBlock className="h-14 w-full rounded-lg" />
      <div className="mt-4 text-center">
        <SkeletonBlock className="h-4 w-16 mx-auto" />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">Checkout</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form Section - Left */}
        <div className="lg:col-span-2">
          {!props.clientSecret || isStripeLoading || !stripePromise ? (
            renderSkeleton()
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret: props.clientSecret }}>
              <StripePaymentIframe />
            </Elements>
          )}
        </div>

        {/* Order Summary Section - Right */}
        <div className="lg:col-span-1">
          <CartSummary {...props} />
        </div>
      </div>
    </div>
  );
}
