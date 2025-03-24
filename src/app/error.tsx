'use client';

import Image from 'next/image';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center my-14 max-w-md mx-auto">
      <Image width={100} height={100} src="/icons/failure-mark.png" alt="Check Mark Icon" className="w-32 h-32 object-cover mx-auto mb-4" />
      <h2 className="text-red-700 font-bold text-xl">ERROR</h2>
      <p>Something went wrong.</p>
      <br />
      <button onClick={() => reset()} className="text-red-700 border-2 border-red-700 px-4 py-2 rounded-md">
        Try Again
      </button>
    </div>
  );
}
