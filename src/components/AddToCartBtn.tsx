'use client';

import React from 'react';
// import { useRouter } from 'next/navigation';

const AddToCartBtn: React.FC<{ productSlug: string; size: string }> = ({ productSlug, size }) => {
  // const router = useRouter();

  const handleAddtoCart = async () => {
    alert('Added to cart!');

    // TODO
    // try {
    //   const data = await fetch('/api/v1/cart', {
    //     method: 'POST',
    //     body: {
    //       productSlug: productSlug,
    //       size: size,
    //     },
    //   });
    //   const response = await data.json();
    //   if (response.status !== 200) {
    //     return router.push('/api/auth/login');
    //   }
    //   const { message } = response;
    //   console.log('POST /cart', response);
    //   alert(message);
    // } catch (err: unknown) {
    //   alert('Requested failed, check the console.');
    //   console.error(err);
    // }
  };
  return <button onClick={handleAddtoCart}>Add to Cart</button>;
};

export default AddToCartBtn;
