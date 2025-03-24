'use client';

import { useState } from 'react';

function PaymentNotice() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6 text-sm text-yellow-800">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">Test Payment Details</p>
          <p>Please use the following dummy data for testing:</p>
          <p className="mt-1 font-mono">
            Card: 4242 4242 4242 4242 <br />
            Exp: 12/34 <br />
            CSV: 123
          </p>
        </div>
        <button onClick={() => setIsVisible(false)} className="text-yellow-600 hover:text-yellow-800 focus:outline-none">
          ✕
        </button>
      </div>
    </div>
  );
}

export default PaymentNotice;
