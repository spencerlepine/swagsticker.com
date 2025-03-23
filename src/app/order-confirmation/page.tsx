import { notFound, redirect } from 'next/navigation';
import { verifyJwt } from '@/lib/auth';
import { cookies } from 'next/headers';
import OrderConfirmationForm from '@/components/OrderConfirmationForm';
import { stripe } from '@/lib/stripe';

// Auth protected
export default async function OrderConfirmationPage({ searchParams }: { searchParams: { payment_intent?: string } }) {
  const token = cookies().get('swagAuthToken')?.value;
  const { email, error } = verifyJwt(token);
  if (error) return redirect('/signin');

  const paymentIntent = await stripe.paymentIntents.retrieve(searchParams?.payment_intent || '');
  if (!paymentIntent) return notFound();

  return (
    <OrderConfirmationForm
      {...{
        cartItems: JSON.parse(paymentIntent.metadata.cartItems),
        orderSubtotal: paymentIntent.metadata.orderSubtotal,
        shippingCost: paymentIntent.metadata.shippingCost,
        subtotal: paymentIntent.metadata.subtotal,
        email: email || '',
        address: paymentIntent.shipping?.address,
        shipping: {
          ...paymentIntent.shipping,
          phone: paymentIntent.shipping?.phone ?? undefined,
        },
      }}
    />
  );
}
