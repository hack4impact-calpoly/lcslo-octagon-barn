"use client";

import { User, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

const initialData: User[] = [
  {
    id: "728ed52f",
    name: "John doe",
    email: "pending",
    date: "3/8/2025",
  },
  {
    id: "728ed52f",
    name: "John doe",
    email: "pending",
    date: "3/8/2025",
  },
  {
    id: "728ed52f",
    name: "John doe",
    email: "pending",
    date: "3/8/2025",
  },
  {
    id: "728ed52f",
    name: "John doe",
    email: "pending",
    date: "3/8/2025",
  },
  {
    id: "728ed52f",
    name: "John doe",
    email: "pending",
    date: "3/8/2025",
  },
];

//export default async function Page() {
export default function Page() {
  const router = useRouter();
  const [data, setData] = useState<User[]>(initialData);
  const [creatingUser, setCreatingUser] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleCreateUser = () => {
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
    };
    sessionStorage.setItem("assignedUser", JSON.stringify(newUser));
    router.push("/create-event");
  };

  const handleCancel = () => {
    router.push("/create-event");
  };

  return (
    <div className="container mx-auto py-10">
      {!creatingUser ? (
        <>
          <div className="flex items-center justify-between py-5">
            <Input type="text" placeholder="Search users..." className="w-[500px] text-2xl placeholder:text-xl" />
          </div>
          <DataTable columns={columns} data={data} />
          <div className="flex justify-end py-8 space-x-6">
            <Button className="bg-red-500 text-white px-4 py-2 text-lg w-[250px]" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className="bg-[#3A6F8F] text-white px-4 py-2 text-lg w-[250px]"
              onClick={() => setCreatingUser(true)}
            >
              Create User
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* ✨ User Creation Form */}
          <div className="flex flex-col items-center space-y-6 py-10">
            <h2 className="text-3xl font-bold">Create a New User</h2>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-[400px] text-xl"
            />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[400px] text-xl"
            />
            <div className="flex space-x-4 pt-6">
              <Button className="bg-[#3A6F8F] text-white px-6 py-3 text-lg" onClick={handleCreateUser}>
                Save User
              </Button>
              <Button variant="destructive" className="px-6 py-3 text-lg" onClick={() => setCreatingUser(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
