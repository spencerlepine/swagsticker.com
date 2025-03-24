import { cookies } from 'next/headers';
import LogoutBtn from '@/components/LogoutBtn';
import { OrderCard } from '@/components/OrderCard';
import { redirect } from 'next/navigation';
import { verifyJwt } from '@/lib/auth';
import Image from 'next/image';
import { SwagOrderDetails } from '@/types';
import { getOrdersByEmail } from '@/lib/stripe';

export default async function AccountPage() {
  const token = cookies().get('swagAuthToken')?.value;
  const { email, error } = verifyJwt(token);
  if (error) return redirect('/signin');

  const orders: SwagOrderDetails[] = await getOrdersByEmail(email as string);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image src="/icons/user-placeholder.jpg" alt="Profile Picture" fill className="object-cover rounded-full" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{email}</h2>
                <p className="text-sm text-gray-500">Manage your account</p>
              </div>
            </div>
            <LogoutBtn />
          </div>
        </div>

        {/* Order History Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order History</h2>
          <p className="text-sm text-gray-500 mb-6">(within the last 180 days)</p>

          {!orders ||
            (orders.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <p className="text-xl font-semibold mb-2">No Orders Found</p>
                <p className="text-sm">View orders after purchasing an item.</p>
              </div>
            ))}

          {orders.length > 0 && (
            <div className="space-y-6">
              {orders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
