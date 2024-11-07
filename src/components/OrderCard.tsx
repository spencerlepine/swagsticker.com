import { Order } from '@/types';
import { FaReceipt } from 'react-icons/fa6';

export function OrderCard({ order }: { order: Order }) {
  return (
    <div className="w-full border border-gray-300 rounded-md">
      <div className="card">
        <div className="card-header p-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h2 className="text-lg font-bold">Order ID: {order.id}</h2>
              <p className="text-sm text-gray-500">Order date: {order.date}</p>
              {/* 
                  TODO_PRINTIFY_ORDER - tracking #
                <div className="mb-6 space-y-4 flex-row">
                  {orderDetails.trackingNumber ? (
                    <Button variant="link" className="p-0 h-auto font-normal text-sm text-blue-600 hover:text-blue-800" onClick={handleTrackingClick}>
                      <MdOutlineLocalShipping className="w-4 h-4 mr-1" />
                      Track Package: {orderDetails.trackingNumber}
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">Status: {orderDetails.status}</p>
                  )}
                </div> 
              */}
            </div>
            <div className="flex items-center space-x-4">
              <p className="font-medium">Total: ${order.total.toFixed(2)}</p>
              <a
                href={order.receiptUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-200">
                View Receipt
                <FaReceipt className="w-4 h-4 ml-1 inline" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
