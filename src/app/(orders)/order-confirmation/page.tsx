import { memo } from 'react';
import OrderConfirmation from '@/components/OrderConfirmation';
import { validateStripeSession } from '@/lib/stripe';
import { notFound } from 'next/navigation';

// Redirect page after successful checkout
// <baseUrl>/order-confirmation?session_id=cs_test_b1FKoQomBOaQFgMqW1lU6oYXRwIruD6AbGV804gMZRrptJr1bF91sDmK5T
const OrderConfirmationPage: React.FC<{ searchParams: { [key: string]: string | undefined } }> = async ({ searchParams }) => {
  const sessionId = searchParams['session_id'];
  const { validSession } = await validateStripeSession(sessionId);
  if (!validSession) return notFound();

  return (
    <div className="my-8 mx-20">
      <OrderConfirmation />
    </div>
  );
};

export default memo(OrderConfirmationPage);
