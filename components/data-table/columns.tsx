"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { parseISO } from "date-fns"

export type Analytics = {
  date: string
  revenue: number
  users: number
  category: string
  sales: number
  profit: number
}

export const columns: ColumnDef<Analytics>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return <div className="w-[100px]">{row.getValue("date")}</div>
    },
    sortingFn: "text",
    size: 100,
  },
  {
    accessorKey: "revenue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Revenue" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("revenue"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="text-right font-medium w-[80px]">{formatted}</div>
    },
    size: 80,
  },
  {
    accessorKey: "users",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Users" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium w-[80px]">
          {new Intl.NumberFormat("en-US").format(row.getValue("users"))}
        </div>
      )
    },
    size: 80,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      return <div className="w-[80px]">{row.getValue("category")}</div>
    },
    size: 80,
  },
  {
    accessorKey: "sales",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sales" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("sales"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="text-right font-medium w-[80px]">{formatted}</div>
    },
    size: 80,
  },
  {
    accessorKey: "profit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Profit" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("profit"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="text-right font-medium w-[80px]">{formatted}</div>
    },
    size: 80,
  },
]
