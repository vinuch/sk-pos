"use client"

import { ColumnDef } from "@tanstack/react-table"
import { OrderData } from "./OrderTabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  order: string
}

export const columns: ColumnDef<OrderData>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "order",
    header: "Order",
    cell: ({ row }) => {
      const order = String(row.getValue("order"))


      return <div className="w-36 md:w-6/12 flex items-center">
        <span className="text-left truncate">{order}</span>
      </div>

    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
