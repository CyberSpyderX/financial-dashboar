import { ArrowUpDown } from "lucide-react";
import { format, parse } from "date-fns";
import { InferResponseType } from "hono";
import { ColumnDef } from "@tanstack/react-table";

import { client } from "@/lib/hono";
import { formatCurrency } from "@/lib/utils";

import Actions from '@/components/TransactionActions';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AccountColumn from "@/features/transactions/components/AccountColumn";
import CategoryColumn from "@/features/transactions/components/CategoryColumn";

type AccountType = InferResponseType<typeof client.api.transactions.$get, 200>["data"][0];

export const columns: ColumnDef<AccountType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.original.date;
        return format(date, "dd MMMM, yyyy");
      }
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <CategoryColumn
          id={row.original.id}
          category={row.original.category}
          categoryId={row.original.categoryId}
        />
      }
    },
    {
      accessorKey: "payee",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Payee
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        )
      }
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const isIncome = row.original.amount > 0;
        
        return (
          <Badge 
            variant={isIncome ? 'primary' : 'destructive'}
            className='px-3.5 py-2.5 text-xs font-medium'
            >
            { formatCurrency(row.original.amount) }
          </Badge>
        )
      }
    },
    {
      accessorKey: "account",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Account
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <AccountColumn 
          account={row.original.account}
          accountId={row.original.accountId}
        />
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Actions id={ row.original.id } />
      )
    }
  ]