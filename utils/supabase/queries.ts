import { OrderItem } from "@/app/home/NewOrder";
import { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

export const getMenuItems = cache(async (supabase: SupabaseClient) => {
  const { data } = await supabase
    .from("MenuItems")
    .select("*")
    .neq("is_addon", "true");

  return data;
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
    .order('id', { ascending: false })


  return data;
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
