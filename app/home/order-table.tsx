//@ts-nocheck
"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { FaEdit } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useEffect, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { FaMinus, FaRegTrashCan } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { useToast } from "@/components/hooks/use-toast";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}


type OrderItem = { created_at: string; id: number; menu_item_id: number | null; order_id: number | null; }

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  const supabase = createClient();
  const { toast } = useToast()

  const [selectedOrder, setSelectedOrder] = useState<any>()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [swallows, setSwallows] = useState<any[]>()
  const [proteins, setProteins] = useState<any[]>()
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>()


  useEffect(() => {
    async function getOrderItems() {
      const { data } = await supabase
        .from("OrderItems")
        .select("*")
        .eq('order_id', selectedOrder ? selectedOrder.id : '')

      setSelectedOrderItems(data);
    }
    if (selectedOrder) {
      getOrderItems();
    }

    // console.log(orderItems)

  }, [selectedOrder, supabase]);

  useEffect(() => {
    async function getSwallows() {
      const { data } = await supabase
        .from("MenuItems")
        .select("*")
        .eq("type", "swallow");

      setSwallows(data)
    }
    async function getProteins() {
      const { data } = await supabase
        .from("MenuItems")
        .select("*")
        .eq("type", "protein");

      setProteins(data)
    }

    getSwallows()
    getProteins()


  }, [supabase])


  async function cancelOrder(id) {
    const { data } = await supabase
      .from("Orders")
      .update({ status: 'cancelled' })
      .eq("id", Number(id));


    toast({
      title: `Order #${selectedOrder.id} Cancelled successfully`,
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}

                data-state={row.getIsSelected() && "selected"}
              >
                <Dialog>
                  {row.getVisibleCells().map((cell) => (
                    <DialogTrigger key={cell.id} asChild onClick={(e) => { e.stopPropagation(); setSelectedOrder(row.original); setIsEditing(false); }}>
                      <TableCell style={{ whiteSpace: 'pre-line' }} >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    </DialogTrigger>
                  ))}
                  <DialogContent>
                    <DialogHeader>
                      {selectedOrder ? <DialogTitle>Order #{selectedOrder.id}</DialogTitle> : ''}
                      <DialogDescription>

                        {
                          selectedOrderItems?.map(item => isEditing ? (
                            <Accordion key={item.id} type="single" collapsible className=" w-full">

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

                            </Accordion>) : (
                            <div key={item.id} className=" w-full flex items-start justify-between p-4 rounded-md pr-2 my-2 ">
                              <div className="text-left"> {`${item.name}`}
                                <span className="font-normal">{` ${item.swallow ? '(' + `${item.swallowQty > 1 ? item.swallowQty : ''} ` + item.swallowName + ')' : ''} `}</span>
                                {item.swallow && item.protein ? <span>{` & `}</span> : ''}
                                <span className="font-normal">{`${item.protein ? '(' + `${item.proteinQty > 1 ? item.proteinQty : ''} ` + item.proteinName + ')' : ''} `}</span>
                                <br />
                                <span className="text-green-500">₦ {item.total}</span>
                              </div>
                              <button onClick={() => { }}>
                                {/* <FaEdit /> */}
                              </button>






                            </div>
                          ))
                        }



                        {
                          isEditing ? (
                            <div className="flex justify-between my-4">
                              <Button size="sm" variant="default" className="text-sm">
                                Add Item
                              </Button>
                              <div className="flex gap-3">
                                <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
                                  cancel
                                </Button>
                                <Button size="sm" variant="default">
                                  save
                                </Button>
                              </div>

                            </div>
                          ) :
                            selectedOrder && selectedOrder.status === 'pending' ? (
                              <div className="flex justify-between my-4">
                                <Dialog>
                                  <DialogTrigger>
                                    <Button size="sm" variant="destructive" className="text-sm">
                                      Cancel order
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Are you sure?</DialogTitle>
                                      <DialogDescription>
                                        This action cannot be undone. This will cancel Order #{selectedOrder ? selectedOrder.id : ''}.

                                        <div className="flex gap-3 justify-end my-4">
                                          <DialogClose asChild>
                                            <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
                                              no
                                            </Button>
                                          </DialogClose>
                                          <DialogClose asChild>
                                            <Button size="sm" variant="default" onClick={() => cancelOrder(selectedOrder.id)}>
                                              yes
                                            </Button>
                                          </DialogClose>
                                        </div>
                                      </DialogDescription>
                                    </DialogHeader>
                                  </DialogContent>
                                </Dialog><div className="flex  gap-3 ">
                                  <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
                                    edit
                                  </Button>
                                  <Button size="sm" variant="default">
                                    pay
                                  </Button>
                                </div>

                              </div>
                            ) : <div></div>

                        }

                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}