
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Payment, columns } from "./home/columns";
import { OrdersProvider } from "@/context/OrdersContext"; // Import the provider
import {
  getMenuItems,
  getOrders,
  getProteins,
  getSwallows,
} from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

import { NewOrder } from "./home/NewOrder";
import { OrderTabs } from "./home/OrderTabs";
import { useEffect } from "react";
import Navbar from "./components/Navbar";

export default async function Home() {

  const supabase = createClient();
  const [menuItems, swallows, proteins, orders] = await Promise.all([
    getMenuItems(supabase),
    getSwallows(supabase),
    getProteins(supabase),
    getOrders(supabase),
  ]);

  // const data: Payment[] = [
  //   {
  //     id: "728ed52f",
  //     amount: 11600,
  //     status: "pending",
  //     order: "- Okra ( Garri) & (4 Beef), \n - vegetable ( Garri) & (2 Goat meat), \n - vegetable ( Garri) & (2 Goat meat)",
  //   },
  //   {
  //     id: "728ed52f",
  //     amount: 100,
  //     status: "pending",
  //     order: "m@example.com",
  //   },
  // ]

  return (
    <main className="min-h-screen">
      <OrdersProvider>
      <Navbar />

      

      <div className="p-3">
        <div className=" py-12">
          <Input placeholder="Search menu item " />
          <NewOrder
            menuItems={menuItems}
            swallows={swallows}
            proteins={proteins}
          />
        </div>

        <div>
          <div className="flex justify-center items-center">
            <OrderTabs />
          </div>
        </div>
      </div>
      </OrdersProvider>
    </main>
  );
}
