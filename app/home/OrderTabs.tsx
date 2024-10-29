'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "./order-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { useOrders } from "@/context/OrdersContext";
import { createClient } from "@/utils/supabase/client";

import { Database } from "@/utils/types/supabase";
// Type aliases for easier access
export type OrdersRow = Database["public"]["Tables"]["Orders"]["Row"];

export function OrderTabs() {
    const [data, setData] = useState<OrdersRow[]>([]);
    const { orders } = useOrders();

    const [allOrders, setAllOrders] = useState<OrdersRow[]>([]);
    const [pendingOrders, setPendingOrders] = useState<OrdersRow[]>([]);
    const [completedOrders, setCompletedOrders] = useState<OrdersRow[]>([]);
    // const [tabValue, setTabValue] = useState('all')
    const supabase = createClient();

    // useEffect(() => {
    //     if (orders) {
    //         const updatedData = orders.map(item => ({
    //             id: item.id,
    //             amount: item.total_amount,
    //             status: item.status,
    //             order: item.order_summary,
    //         }));
    //         setData(updatedData);
    //     }
    // }, [orders]);

    useEffect(() => {
        async function getAllOrders() {
            const { data } = await supabase
                .from("Orders")
                .select("*")
                .order('id', { ascending: false })

            
            setAllOrders(data as OrdersRow[])

        }
        async function getPendingOrders() {
            const { data } = await supabase
                .from("Orders")
                .select("*")
                .eq('status', 'pending')
                .order('id', { ascending: false })

            setPendingOrders(data as OrdersRow[])

        }
        async function getCompletedOrders() {
            const { data } = await supabase
                .from("Orders")
                .select("*")
                .eq('status', 'completed')
                .order('id', { ascending: false })

            setCompletedOrders(data as OrdersRow[])

        }


        getAllOrders()
        getCompletedOrders()
        getPendingOrders()

    }, [supabase])

    return (
        <Tabs defaultValue="all" className="w-full text-center">
            <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="text-left mt-8">
                <DataTable columns={columns} data={allOrders} />
            </TabsContent>
            <TabsContent value="pending" className="text-left mt-8">
                <DataTable columns={columns} data={pendingOrders} />
            </TabsContent>
            <TabsContent value="completed" className="text-left mt-8">
                <DataTable columns={columns} data={completedOrders} />
            </TabsContent>
        </Tabs>
    )
}
