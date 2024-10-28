import { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";
import { Database } from "@/utils/types/supabase";
// Type aliases for easier access
export type OrdersRow = Database["public"]["Tables"]["Orders"]["Row"];
export type MenuItemsRow = Database["public"]["Tables"]["MenuItems"]["Row"];

export const getMenuItems = cache(async (supabase: SupabaseClient) => {
  const { data, error } = await supabase
    .from("MenuItems")
    .select("*")
   

  if (error) {
    console.error("Error fetching menu items:", error);
  }
  return data as MenuItemsRow[];
});
export const getMenuItemsNonAddon = cache(async (supabase: SupabaseClient) => {
  const { data, error } = await supabase
    .from("MenuItems")
    .select("*")
    .neq("is_addon", "true");

  if (error) {
    console.error("Error fetching menu items:", error);
  }
  return data as MenuItemsRow[];
});
export const getSwallows = cache(async (supabase: SupabaseClient) => {
  const { data } = await supabase
    .from("MenuItems")
    .select("*")
    .eq("type", "swallow");

  return data;
});
export const getProteins = cache(async (supabase: SupabaseClient) => {
  const { data } = await supabase
    .from("MenuItems")
    .select("*")
    .eq("type", "protein");

  return data;
});
export const getOrders = cache(async (supabase: SupabaseClient) => {
  const { data } = await supabase
    .from("Orders")
    .select("*")
    .order("id", { ascending: false });

  return data as OrdersRow[];
});
// export const getOrderItems = cache(async (supabase: SupabaseClient) => {
//   const { data } = await supabase
//     .from("OrderItems")
//     .select("*")
//     .eq(order_id)

//   return data;
// });

// export const createOrder = cache(async (supabase: SupabaseClient, order: OrderItem) => {
//   const { data, error } = await supabase
//     .from("Orders")
//     .insert([{ some_column: "someValue", other_column: "otherValue" }])
//     .select();

//   return data
// });
