"use client";
import { User, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/loadingStates";

async function getData(): Promise<User[]> {
  const response = await fetch("/api/user", {
    method: "GET",
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const userData = await response.json();
  return userData.map((user: any) => ({
    id: user.id,
    name: user.firstName + " " + user.lastName,
    email: user.emailAddresses[0].emailAddress,
    date: new Date(user.createdAt).toLocaleDateString(),
  }));
}

export default function Page() {
  const [unfilteredData, setUnfilteredData] = useState<User[]>([]);
  const [data, setData] = useState<User[]>([]);
  const [searchItem, setSearchItem] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getData()
      .then((data) => {
        setUnfilteredData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filteredData = unfilteredData.filter((item) => item.name.toLowerCase().startsWith(searchItem.toLowerCase()));
    setData(filteredData);
  }, [searchItem, unfilteredData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-center items-center text-3xl text-[var(--primary-blue)] rounded-l font-bold mb-4">
        Clients
      </div>
      <div className="flex items-center justify-between py-5">
        <Input
          type="text"
          placeholder="Search for clients"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
          className="w-[500px] md:text-lg placeholder:text-lg pxd"
        />
      </div>
      <DataTable columns={columns} data={data} />
      <div className="flex justify-end py-8 space-x-6">
        <Button
          className="bg-red-500 text-white px-4 py-2 text-lg w-[250px]"
          onClick={() => router.push("/create-event")}
        >
          Cancel
        </Button>
        <Button className="bg-[#3A6F8F] text-white px-4 py-2 text-lg w-[250px]">Create User</Button>
      </div>
    </div>
  );
}
