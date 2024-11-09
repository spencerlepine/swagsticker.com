import OrderConfirmation from '@/components/OrderConfirmation';
import { stripe } from '@/lib/stripe';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic'; // Dynamic server-side rendering

async function getSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId!);
    return session;
  } catch (error) {
    return null;
  }
}

// Redirect page after successful checkout
// <baseUrl>/order-confirmation?session_id=cs_test_b1FKoQomBOaQFgMqW1lU6oYXRwIruD6AbGV804gMZRrptJr1bF91sDmK5T
const OrderConfirmationPage: React.FC<{ searchParams: { [key: string]: string | undefined } }> = async ({ searchParams }) => {
  const sessionId = searchParams['session_id'];
  if (!sessionId) return notFound();

  const session = await getSession(sessionId);
  if (!session) return notFound();

  if (session?.status === 'open') {
    return <p>Payment did not work.</p>;
  }

  if (session?.status === 'complete') {
    return (
      <div className="my-8 mx-20">
        <OrderConfirmation />
      </div>
    );
  }

  return notFound();
};

export default OrderConfirmationPage;
