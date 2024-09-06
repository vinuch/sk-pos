"use client"

import { useToast } from "@/components/hooks/use-toast"
// import { toast } from "sonner"

import { useState } from "react"
import { FaClipboardCheck, FaMinus, FaRegTrashCan } from "react-icons/fa6";
import { IoAddOutline } from "react-icons/io5";
import { v4 as uuidv4 } from 'uuid';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import { revalidatePath } from "next/cache";


type NewOrderProps = {
    menuItems: any[] | null;
    swallows: any[] | null;
    proteins: any[] | null;
}

export type OrderItem = {
    id: string;
    itemId: number;
    name: string;
    // qty?: number;
    mixed?: boolean;
    mixItemId?: number;
    swallow?: number;
    swallowPrice?: number;
    swallowQty: number;
    proteinQty: number;
    swallowName?: string;
    protein?: number;
    proteinName?: string;
    proteinPrice?: number;
    proteinPerServing: number;
    total: number;
    price: number;
}

export function NewOrder({ menuItems, swallows, proteins }: NewOrderProps) {
    const supabase = createClient();
    const { toast } = useToast()

    const [orderItems, setOrderItems] = useState<OrderItem[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    function addToOrder(itemId: number, itemName: string, itemPrice: number) {
        // const exists = orderItems.find(orderItem => orderItem.itemId === itemId)

        //     setOrderItems(prevItems => prevItems.map(item => item.itemId === itemId ? { ...item, qty: item.qty + 1 } : item))
        // if (!exists) {
        setOrderItems([...orderItems, { id: uuidv4(), itemId, name: itemName, swallowQty: 1, proteinQty: 1, total: itemPrice, price: itemPrice, proteinPerServing: 1 }])
        // }
    }

    // function incrementQty(itemId: number) {
    //     const exists = orderItems.find(orderItem => orderItem.itemId === itemId)

    //     if (exists) {
    //         setOrderItems(prevItems => prevItems.map(item => item.itemId === itemId ? { ...item, qty: item.qty + 1, total: item.total + exists.price } : item))
    //     }
    // }
    // function decrementQty(itemId: number) {
    //     const exists = orderItems.find(orderItem => orderItem.itemId === itemId)

    //     if (exists && exists.qty > 1) {
    //         setOrderItems(prevItems => prevItems.map(item => item.itemId === itemId ? { ...item, qty: item.qty - 1, total: item.total - exists.price } : item))
    //     }
    // }
    function setSwallow(itemId: string, swallowId: number, swallowName: string, swallowPrice: number) {
        const exists = orderItems.find(orderItem => orderItem.id === itemId)

        if (exists) {
            setOrderItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, swallow: swallowId, swallowName: swallowName, swallowPrice: swallowPrice } : item))
        }
    }
    function incrementSwallow(itemId: string) {
        const exists = orderItems.find(orderItem => orderItem.id === itemId)

        if (exists) {
            setOrderItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, swallowQty: item.swallowQty + 1, total: item.swallowQty >= 1 ? item.total + exists.swallowPrice! : item.total } : item))
        }
    }
    function decrementSwallow(itemId: string) {
        const exists = orderItems.find(orderItem => orderItem.id === itemId)

        if (exists && exists.swallowQty > 0) {
            setOrderItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, swallowQty: item.swallowQty - 1, total: item.swallowQty > 1 ? item.total - exists.swallowPrice! : item.total } : item))
        }
    }
    function setProtein(itemId: string, proteinId: number, proteinName: string, proteinPrice: number, proteinPerServing: number) {
        const exists = orderItems.find(orderItem => orderItem.id === itemId)

        if (exists) {
            setOrderItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, protein: proteinId, proteinName: proteinName, proteinQty: proteinPerServing, proteinPrice: proteinPrice, proteinPerServing } : item))
        }
    }
    function incrementProtein(itemId: string) {
        const exists = orderItems.find(orderItem => orderItem.id === itemId)

        if (exists) {
            setOrderItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, proteinQty: item.proteinQty + 1, total: item.proteinQty >= item.proteinPerServing ? item.total + exists.proteinPrice! : item.total } : item))
        }
    }
    function decrementProtein(itemId: string) {
        const exists = orderItems.find(orderItem => orderItem.id === itemId)

        if (exists && exists.proteinQty > 0) {
            setOrderItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, proteinQty: item.proteinQty - 1, total: item.proteinQty > item.proteinPerServing ? item.total - exists.proteinPrice! : item.total } : item))
        }
    }
    function removeItem(itemId: string) {
        const exists = orderItems.find(orderItem => orderItem.id === itemId)

        if (exists) {

            setOrderItems(orderItems.filter(item => item.id !== itemId))
        }
    }
    async function handleCreateOrder() {
        setLoading(true)


        let total = orderItems.reduce(
            (accumulator, currentValue) => accumulator + currentValue.total,
            0,
        )

        let order_summary = orderItems.map(item => `${item.name} ${item.swallow ? `${item.swallowQty} ${item.swallowName}` : ''} ${item.protein ? `${item.proteinQty} ${item.proteinName}` : ''}`)
        // await createOrder(orderItems, total)
        const { data, error } = await supabase
            .from("Orders")
            .insert([{ total_amount: total, order_summary: order_summary.join(', ') }])
            .select();

        if (data) {
            let orderId = data[0].id
            const { data: orderItem, error } = await supabase
                .from("OrderItems")
                .insert(orderItems.map(item => {
                    let { ['id']: _, ['itemId']: __, ...rest } = item;
                    return { ...rest, order_id: orderId, menu_item_id: item.itemId }
                }))
                .select();


        }
        setLoading(false)
        setOrderItems([])
        toast({
            title: "Order Created successfully",
            description: order_summary.join(', '),
        })

    }
    return (
        <div>
            <div className="flex flex-wrap justify-around gap-3 my-4">
                {
                    menuItems?.map(item => (
                        <div key={item.id} onClick={() => addToOrder(item.id, item.name, item.price)} className={`p-4 rounded-md border border-gray my-2 w-full md:w-48p cursor-pointer relative ${orderItems.find(orderItem => orderItem.itemId === item.id) ? 'bg-slate-100' : ''}`}>
                            <span>{item.name}</span>
                            {
                                orderItems.find(orderItem => orderItem.itemId == item.id) ?
                                    <span className="text-white bg-red-500 rounded-full inline-flex h-5 w-5  items-center justify-center text-sm absolute right-5 -top-1">{orderItems.filter(orderItem => orderItem.itemId == item.id).length}</span> :
                                    null
                            }
                            {
                                orderItems.find(orderItem => orderItem.itemId === item.id) ? (<span className="absolute -right-0 -top-1">
                                    <FaClipboardCheck />
                                </span>) : null
                            }

                        </div>
                        // <Dialog key={item.id}>
                        //   <div className=" rounded-md border border-gray my-2 w-48p cursor-pointer">
                        //     <DialogTrigger className="w-full">
                        //       <div className="w-full p-4 text-left">
                        //         {item.name}
                        //       </div>
                        //     </DialogTrigger>
                        //     <DialogContent>
                        //       <DialogHeader>
                        //         <DialogTitle>Are you absolutely sure?</DialogTitle>
                        //         <DialogDescription>
                        //           This action cannot be undone. This will permanently delete your account
                        //           and remove your data from our servers.
                        //         </DialogDescription>
                        //       </DialogHeader>
                        //     </DialogContent>
                        //   </div>
                        // </Dialog>

                    ))
                }

            </div>

            {
                orderItems.length ? (
                    <>
                        <h2 className="font-semibold text-center">New Order</h2>
                        <div className="flex gap-2 flex-wrap justify-center my-4">


                            <Accordion type="single" collapsible className="md:w-6/12 w-full">
                                {
                                    orderItems?.map((item, idx) => (
                                        <AccordionItem key={item.id} value={item.name}>
                                            <AccordionTrigger>   <div className=" w-full flex items-center justify-between p-4 rounded-md pr-2 my-2 ">
                                                <div className="text-left"> {`${item.name}`}
                                                    <span className="font-normal">{` ${item.swallow ? '(' + `${item.swallowQty > 1 ? item.swallowQty : ''} ` + item.swallowName + ')' : ''} `}</span>
                                                    {item.swallow && item.protein ? <span>{` & `}</span> : ''}
                                                    <span className="font-normal">{`${item.protein ? '(' + `${item.proteinQty > 1 ? item.proteinQty : ''} ` + item.proteinName + ')' : ''} `}</span>
                                                    <br />
                                                    <span className="text-green-500">₦ {item.total}</span>
                                                </div>
                                                <button onClick={(e) => { e.stopPropagation(); removeItem(item.id) }}>
                                                    <FaRegTrashCan />
                                                </button>
                                                {/* <div className="flex items-center gap-2">
                                                    {
                                                        item.qty === 1 ? (
                                                            <button onClick={(e) => { e.stopPropagation(); removeItem(item.itemId) }}>
                                                                <FaRegTrashCan />
                                                            </button>
                                                        ) : (
                                                            <button onClick={(e) => { e.stopPropagation(); decrementQty(item.itemId) }}><FaMinus /></button>
                                                        )
                                                    }
                                                    <span>{item.qty}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); incrementQty(item.itemId) }}><IoAddOutline /></button>

                                                </div> */}
                                            </div></AccordionTrigger>
                                            <AccordionContent>
                                                {/* Yes. It adheres to the WAI-ARIA design pattern. */}
                                                <div className="flex p-2 justify-between items-center">
                                                    <span>Swallow:</span>
                                                    <Select onValueChange={(e) => {
                                                        let menuItem = swallows?.find(item => item.id === e)
                                                        setSwallow(item.id, Number(e), menuItem.name, menuItem.price)
                                                    }}>
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder="Select swallow" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {
                                                                swallows?.map(item => (
                                                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>

                                                                ))
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="flex gap-2">
                                                        <button disabled={!item.swallow} className={`${!item.swallow ? 'cursor-not-allowed' : ''}`} onClick={(e) => { e.stopPropagation(); decrementSwallow(item.id) }}><FaMinus /></button>
                                                        <span>{item.swallowQty}</span>
                                                        <button disabled={!item.swallow} className={`${!item.swallow ? 'cursor-not-allowed' : ''}`} onClick={(e) => { e.stopPropagation(); incrementSwallow(item.id) }}><IoAddOutline /></button>
                                                    </div>
                                                </div>
                                                <div className="flex p-2 justify-between items-center">
                                                    <span>Protein:</span>
                                                    <Select onValueChange={(e) => {
                                                        let menuItem = proteins?.find(item => item.id === e)
                                                        setProtein(item.id, Number(e), menuItem.name, menuItem.price, menuItem.per_serving)
                                                    }}>
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder="Select protein" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {
                                                                proteins?.map(item => (
                                                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>

                                                                ))
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="flex gap-2">
                                                        <button disabled={!item.protein} className={`${!item.protein ? 'cursor-not-allowed' : ''}`} onClick={(e) => { e.stopPropagation(); decrementProtein(item.id) }}><FaMinus /></button>
                                                        <span>{item.proteinQty}</span>
                                                        <button disabled={!item.protein} className={`${!item.protein ? 'cursor-not-allowed' : ''}`} onClick={(e) => { e.stopPropagation(); incrementProtein(item.id) }}><IoAddOutline /></button>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                            </Accordion>



                        </div>

                        <div className="w-6/12 mx-auto">
                            Total: <span className="text-green-500">₦ {orderItems.reduce(
                                (accumulator, currentValue) => accumulator + currentValue.total,
                                0,
                            )}
                            </span>
                        </div>

                        <div className="flex justify-center mt-4">
                            <Button variant="secondary" disabled={loading} onClick={handleCreateOrder}>{loading ? <AiOutlineLoading3Quarters className="animate-spin w-6 h-6" /> : <span>Create new Order</span>}</Button>

                        </div>
                    </>
                ) : null
            }



        </div>
    )
}
