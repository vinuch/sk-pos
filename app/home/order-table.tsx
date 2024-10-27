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
import { useEffect, useState } from "react";
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

  const [selectedOrder, setSelectedOrder] = useState<any>()
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>()


  useEffect(() => {
    async function getOrderItems() {

      if(selectedOrder) {
          const { data } = await supabase
        .from("OrderItems")
        .select("*")
        .eq('order_id', selectedOrder ? selectedOrder.id : '')

      setSelectedOrderItems(data);
      }
    
    }

    getOrderItems();

    // console.log(orderItems)

  }, [selectedOrder, supabase]);


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
                    <DialogTrigger key={cell.id} asChild onClick={(e) => { e.stopPropagation(); setSelectedOrder(row.original); console.log('click') }}>
                      <TableCell style={{ whiteSpace: 'pre-line' }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    </DialogTrigger>
                  ))}
                  <DialogContent>
                    <DialogHeader>
                      {selectedOrder ? <DialogTitle>Order #{selectedOrder.id}</DialogTitle> : ''}
                      <DialogDescription>
                        {
                          selectedOrderItems?.map(item => (
                            <div key={item.id} className=" w-full flex items-start justify-between p-4 rounded-md pr-2 my-2 ">
                              <div className="text-left"> {`${item.name}`}
                                <span className="font-normal">{` ${item.swallow ? '(' + `${item.swallowQty > 1 ? item.swallowQty : ''} ` + item.swallowName + ')' : ''} `}</span>
                                {item.swallow && item.protein ? <span>{` & `}</span> : ''}
                                <span className="font-normal">{`${item.protein ? '(' + `${item.proteinQty > 1 ? item.proteinQty : ''} ` + item.proteinName + ')' : ''} `}</span>
                                <br />
                                <span className="text-green-500">₦ {item.total}</span>
                              </div>
                              <button onClick={() => { }}>
                                <FaEdit />
                              </button>

                            </div>
                          ))
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