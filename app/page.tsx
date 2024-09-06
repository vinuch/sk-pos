import Image from "next/image";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Payment, columns } from "./home/columns";
import { getMenuItems, getOrders, getProteins, getSwallows } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";


import { NewOrder } from "./home/NewOrder";
import { OrderTabs } from "./home/OrderTabs";


export default async function Home() {
  const supabase = createClient();
  const [menuItems, swallows, proteins, orders] = await Promise.all([
    getMenuItems(supabase),
    getSwallows(supabase),
    getProteins(supabase),
    getOrders(supabase),
  ])

  console.log(menuItems)
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
      <nav className="flex justify-between z-50 sticky top-0 bg-black text-white p-3">
        <h2>SK POS</h2>

        <ul className="flex gap-2">
          {/* <li>Home</li>
          <li>Menu</li> */}
          {/* <li>Account</li> */}
        </ul>
      </nav>

      <div className="p-3">
        <div className=" py-12">
          <Input placeholder="Search menu item " />





          <NewOrder menuItems={menuItems} swallows={swallows} proteins={proteins} />



        </div>

        <div>
          <div className="flex justify-center items-center">
            <OrderTabs orders={orders} />
          </div>
        </div>
      </div>
    </main>
  );
}
