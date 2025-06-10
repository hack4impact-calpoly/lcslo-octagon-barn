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

const handleDeleteUser = async (row: User) => {
  if (!confirm("Delete this users?")) return;
  try {
    const res = await fetch(`/api/user/${row.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Failed to delete user");
    }

    console.log("User deleted successfully");
  } catch (error) {
    console.log("Delete error:", error);
  }
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
    header: "Delete",
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => {
            handleDeleteUser(row.original);
          }}
          className="bg-transparent border-none p-0 m-0 cursor-pointer"
        >
          <i className="icon-[ic--baseline-delete-forever] text-rose-500 h-6 w-6" aria-hidden="true"></i>
        </Button>
      );
    },
  },
];
