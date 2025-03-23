import { cookies } from 'next/headers';
import LogoutBtn from '@/components/LogoutBtn';
import { OrderCard } from '@/components/OrderCard';
import { redirect } from 'next/navigation';
import { verifyJwt } from '@/lib/auth';
import Image from 'next/image';
import { OrderDetails } from '@/types';
import { getOrdersByEmail } from '@/lib/stripe';

// Auth protected
export default async function AccountPage() {
  const token = cookies().get('swagAuthToken')?.value;
  const { email, error } = verifyJwt(token);
  if (error) return redirect('/signin');

  const orders: OrderDetails[] = await getOrdersByEmail(email as string);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 border border-gray-300 rounded-md">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <Image width={64} height={64} src="/icons/user-placeholder.jpg" alt="Profile Picture" className="w-12 h-12 object-cover rounded-full" />
            <div>
              <h2 className="text-lg">{email}</h2>
            </div>
          </div>
          <LogoutBtn />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Order History</h2>
        <p className="text-gray-500">(within the last 180 days)</p>

        {!orders ||
          (orders.length === 0 && (
            <div className="flex justify-center items-center my-32">
              <div className="text-center text-gray-500">
                <p className="text-xl font-bold">No orders found</p>
                <p className="text-sm">View orders after purchasing an item.</p>
              </div>
            </div>
          ))}

        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
