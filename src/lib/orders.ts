import { Order } from "@/types";
import { getChargesByEmail } from "./stripe";
import type { Stripe as StripeType } from 'stripe';

function formatStripeCharges(charges: StripeType.Charge[]) {
  return charges.map((charge: StripeType.Charge)  => ({
    id: charge.id,
    date: new Date(charge.created * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    total: charge.amount / 100,
    address: charge.shipping?.address as StripeType.Address,
    last4: charge.payment_method_details?.card?.last4 || null,
    receiptUrl: charge.receipt_url || null,
  }));
}

export async function getOrders(customerEmail: string): Promise<Order[]> {
  const charges = await getChargesByEmail(customerEmail);
  const formattedCharges = formatStripeCharges(charges)
  return formattedCharges;
}
