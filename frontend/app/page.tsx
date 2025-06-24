'use client';

import dynamic from 'next/dynamic';

const CreateOrder = dynamic(() => import('../src/components/CreateOrder'), { ssr: false });

export default function OrderPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Order</h1>
      <CreateOrder />
    </>
  );
}
