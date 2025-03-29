"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export type User = {
  id: string;
  name: string;
  email: string;
  date: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Client name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "date",
    header: "Date Added",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <Button style={{ backgroundColor: "#3A6F8F" }} className="text-white w-full px-2 py-1 text-lg rounded">
          Assign
        </Button>
      );
    },
  },
];
