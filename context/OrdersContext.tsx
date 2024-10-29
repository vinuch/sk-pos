"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactElement,
  useCallback,
  ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { getOrders } from "@/utils/supabase/queries";
import { useToast } from "@/components/hooks/use-toast";
import { Database } from "@/utils/types/supabase";
// Type aliases for easier access
export type OrdersRow = Database["public"]["Tables"]["Orders"]["Row"];
export type OrderItemRow = Database["public"]["Tables"]["OrderItems"]["Row"];
export type OrderItemInsert =
  Database["public"]["Tables"]["OrderItems"]["Insert"];

interface OrdersContextType {
  orders: OrdersRow[];
  addNewOrder: (
    order_summary: string[],
    total: number,
    orderItems: OrderItemInsert[]
  ) => Promise<void>;
  updateOrder: (
    order_id: number,
    order_summary: string[],
    total: number,
    orderItems: OrderItemInsert[]
  ) => Promise<void>;
  deleteOrderItemsInList: (
    orderId: string,
    itemIds: string[]
  ) => Promise<void>;
  deleteOrderItem: (
    itemId: number
  ) => Promise<void>;
}

interface OrdersProviderProps {
  children: ReactNode;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

// export const useOrders = () => useContext(OrdersContext);

function OrdersProvider({ children }: OrdersProviderProps) {
  const [orders, setOrders] = useState<OrdersRow[]>([]);
  const supabase = createClient();
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    const orders = await getOrders(supabase);
    setOrders(orders);
  }, [supabase]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addNewOrder = async (
    order_summary: string[],
    total: number,
    orderItems: OrderItemInsert[]
  ) => {
    const { data, error } = await supabase
      .from("Orders")
      .insert([
        { total_amount: total, order_summary: order_summary.join(", ") },
      ])
      .select();

    if (data) {
      let orderId = data[0].id;
      const { data: orderItem, error } = await supabase
        .from("OrderItems")
        .insert(
          orderItems.map((item) => {
            let { ["id"]: _, ["menu_item_id"]: __, ...rest } = item;
            return {
              ...rest,
              order_id: orderId,
              menu_item_id: item.menu_item_id,
            };
          })
        )
        .select();

      if (error) {
        toast({ title: "Error creating order" });
      }

      if (error) {
        toast({ title: "Error creating order" });
      } else {
        toast({
          title: "Order Created successfully",
          description: order_summary.join(", "),
        });
      }
      fetchOrders(); // Refetch orders after adding a new one
    }
  };
  const updateOrder = async (
    order_id: number,
    order_summary: string[],
    total: number,
    orderItems: OrderItemInsert[]
  ) => {
    const { data, error } = await supabase
      .from("Orders")
      .update({ total_amount: total, order_summary: order_summary.join(", ") })
      .eq("id", order_id)
      .select();

    if (data) {
      // let orderId = data[0].id;
      const { data: orderItem, error } = await supabase
        .from("OrderItems")
        .upsert(
          orderItems.map((item) => {
            // let { ["id"]: _, ["menu_item_id"]: __, ...rest } = item;
            return {
              ...item,
              order_id: order_id,
              menu_item_id: item.menu_item_id,
            };
          })
        )
        .select();

      if (error) {
        toast({ title: "Error creating order" });
      }

      if (error) {
        toast({ title: "Error creating order" });
      } else {
        toast({
          title: "Order Created successfully",
          description: order_summary.join(", "),
        });
      }
      fetchOrders(); // Refetch orders after adding a new one
    }
  };

  const deleteOrderItemsInList = async (
    orderId: string,
    itemIds: string[]
  ) => {
    // Delete items that are not in the list of IDs
// Only delete items that belong to the specified order and are not in the itemIds list
const { data: deletedData, error: deleteError } = await supabase
  .from("OrderItems")
  .delete()
  .eq("order_id", orderId)
  .in("id", itemIds);

  };
  const deleteOrderItem = async (
    itemId: number,
  ) => {
    // Delete items that are not in the list of IDs
// Only delete items that belong to the specified order and are not in the itemIds list
const { data: deletedData, error: deleteError } = await supabase
  .from("OrderItems")
  .delete()
  .eq("id", itemId)

  };

  return (
    <OrdersContext.Provider
      value={{ orders, addNewOrder, updateOrder, deleteOrderItemsInList, deleteOrderItem }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

/*  */

const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
};

export { OrdersProvider, useOrders };
