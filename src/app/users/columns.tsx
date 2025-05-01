"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type User = {
  id: string;
  name: string;
  email: string;
  date: string;
};

const HandleAssignUser = (row: User) => {
  sessionStorage.setItem(
    "assignedUser",
    JSON.stringify({
      name: row.name,
      email: row.email,
      id: row.id,
    }),
  );
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Client Name",
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
    cell: ({ row }) => {
      return (
        <Button
          style={{ backgroundColor: "#3A6F8F" }}
          className="text-white w-full px-2 py-1 text-lg rounded flex justify-center items-center"
          onClick={() => {
            HandleAssignUser(row.original);
            window.location.href = "/create-event";
          }}
        >
          Assign
        </Button>
      );
    },
  },
];
