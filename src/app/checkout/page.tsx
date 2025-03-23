import { notFound, redirect } from 'next/navigation';
import { verifyJwt } from '@/lib/auth';
import { cookies } from 'next/headers';
import CheckoutForm from '@/components/CheckoutForm';
import { stripe } from '@/lib/stripe';

// Auth protected
async function CheckoutPage({ searchParams }: { searchParams: { clientSecret?: string } }) {
  const token = cookies().get('swagAuthToken')?.value;
  const { error } = verifyJwt(token);
  if (error) return redirect('/signin');

  const paymentIntentId = searchParams?.clientSecret?.split('_secret_')[0];
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId || '');
  if (!paymentIntent) return notFound();

  return (
    <CheckoutForm
      {...{
        cartItems: JSON.parse(paymentIntent.metadata.cartItems),
        orderSubtotal: paymentIntent.metadata.orderSubtotal,
        shippingCost: paymentIntent.metadata.shippingCost,
        subtotal: paymentIntent.metadata.subtotal,
        clientSecret: searchParams?.clientSecret,
      }}
    />
  );
}

export default CheckoutPage;
