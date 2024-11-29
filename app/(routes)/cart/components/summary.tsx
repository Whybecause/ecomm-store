"use client";

import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import toast from "react-hot-toast";

const Summary = () => {
  const searchParams = useSearchParams();
  const cart = useCart();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
    }
    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, []);

  const onCheckout = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          productIds: items.map((item) => item.id),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      window.location = response.data.url;
    } catch (error) {
      console.log("axios fail = ", error);
    }
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>

      <Button onClick={onCheckout}>Checkout</Button>
    </div>
  );
};

export default Summary;
