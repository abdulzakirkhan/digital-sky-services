// hooks/useOrderId.js
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export const useOrderId = () => {
  const [orderId, setOrderId] = useState(null);
  const searchParams = useSearchParams(); // Get search params

  useEffect(() => {
    const id = searchParams.get('id'); // Get the 'id' from query params
    if (id) {
      setOrderId(id);
    }
  }, [searchParams]);

  return { orderId };
};
