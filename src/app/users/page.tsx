import { User, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

async function getData(): Promise<User[]> {
  // Fetch data from your API here.
  return [
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
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between py-5">
        <Input type="text" placeholder="Search users..." className="w-[500px] text-2xl placeholder:text-xl pxd" />
      </div>
      <DataTable columns={columns} data={data} />
      <div className="flex justify-end py-8 space-x-6">
        <Button className="bg-red-500 text-white px-4 py-2 text-lg w-[250px]">Cancel</Button>
        <Button className="bg-[#3A6F8F] text-white px-4 py-2 text-lg w-[250px]">Create User</Button>
      </div>
    </div>
  );
}
