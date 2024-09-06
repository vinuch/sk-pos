'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "./order-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";

type OrderTabsProps = {
    orders: any[] | null
}
export type OrderData = {
    id: any;
    amount: any;
    status: string;
    order: any;
}
export function OrderTabs({ orders }: OrderTabsProps) {
    const [data, setData] = useState<OrderData[]>([]);

    useEffect(() => {
        if (orders) {
            const updatedData = orders.map(item => ({
                id: item.id,
                amount: item.total_amount,
                status: 'pending',
                order: item.order_summary,
            }));
            setData(updatedData);
        }
    }, [orders]);
    return (
        <Tabs defaultValue="all" className="w-full text-center">
            <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="text-left mt-8">
                <DataTable columns={columns} data={data} />
            </TabsContent>
            <TabsContent value="pending" className="text-left mt-8">
                <DataTable columns={columns} data={data} />
            </TabsContent>
            <TabsContent value="completed" className="text-left mt-8">
                <DataTable columns={columns} data={data} />
            </TabsContent>
        </Tabs>
    )
}
