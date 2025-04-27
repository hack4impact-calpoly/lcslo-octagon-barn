"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useMemo } from "react";
import { useState as useReactState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface EventRow {
  id: string;
  eventName: string;
  eventDateStart: string;
  eventDateEnd: string;
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
}

export default function AdminEventDashboard() {
  const { user, isLoaded } = useUser();
  const isAdmin = user?.publicMetadata?.isAdmin === true;
  const [events, setEvents] = useState<EventRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof EventRow; direction: "asc" | "desc" } | null>(null);

  const requestSort = (key: keyof EventRow) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    setLoading(true);
    fetch("/api/event")
      .then((res) => res.json())
      .then((json) => {
        const list = Array.isArray(json) ? json : json.data;
        setEvents(list ?? []);
      })
      .finally(() => setLoading(false));
  }, [isLoaded, isAdmin]);

  const filtered = useMemo(() => {
    let result = events.filter((e) => e.eventName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const { key, direction } = sortConfig;
        let aVal = a[key];
        let bVal = b[key];

        if (key === "eventDateStart" || key === "eventDateEnd") {
          const aTime = new Date(aVal).getTime();
          const bTime = new Date(bVal).getTime();
          return direction === "asc" ? aTime - bTime : bTime - aTime;
        }
        const aStr = String(aVal);
        const bStr = String(bVal);
        return direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [events, searchTerm, sortConfig]);

  const updateStatus = async (id: string, status: EventRow["status"]) => {
    await fetch(`/api/event/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/event/${id}`, { method: "DELETE" });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  if (!isLoaded) {
    return <p className="text-center text-gray-500 text-lg">Loading ...</p>;
  }
  if (!isAdmin) {
    return <p className="text-red-500">Unauthorized</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Input
          placeholder="Search for an event"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          className="max-w-sm py-2 md:text-lg placeholder:text-lg ml-auto"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer text-center text-lg text-black"
              onClick={() => requestSort("eventName")}
            >
              Event Name {sortConfig?.key === "eventName" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </TableHead>
            <TableHead
              className="cursor-pointer text-center text-lg text-black"
              onClick={() => requestSort("eventDateStart")}
            >
              Start Date {sortConfig?.key === "eventDateStart" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </TableHead>
            <TableHead
              className="cursor-pointer text-center text-lg text-black"
              onClick={() => requestSort("eventDateEnd")}
            >
              End Date {sortConfig?.key === "eventDateEnd" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </TableHead>
            <TableHead className="text-center cursor-pointer text-lg text-black" onClick={() => requestSort("status")}>
              Status {sortConfig?.key === "status" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </TableHead>
            <TableHead className="text-center text-lg text-black">View</TableHead>
            <TableHead className="text-center text-lg text-black">Delete</TableHead>
          </TableRow>
        </TableHeader>
        {/* TODO: Fix styling of loading and no events found*/}
        <TableBody>
          {loading ? (
            <p></p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">No events found</p>
          ) : (
            filtered.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="!text-center text-lg">{e.eventName}</TableCell>
                <TableCell className="!text-center text-lg">{new Date(e.eventDateStart).toLocaleString()}</TableCell>
                <TableCell className="!text-center text-lg">{new Date(e.eventDateEnd).toLocaleString()}</TableCell>
                <TableCell className="!text-center">
                  <Select value={e.status} onValueChange={(val) => updateStatus(e.id, val as EventRow["status"])}>
                    <SelectTrigger className="mx-auto justify-center text-lg">
                      <SelectValue className="text-center" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Upcoming", "Ongoing", "Completed", "Cancelled"].map((s) => (
                        <SelectItem key={s} value={s} className="text-lg">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="!text-center">
                  <Link
                    href={`/view/event/${e.id}`}
                    className="bg-basic-blue text-white text-lg hover:text-black px-6 py-3 rounded-full"
                  >
                    View Event
                  </Link>
                </TableCell>
                <TableCell className="!text-center">
                  <Button variant="ghost" size="icon" onClick={() => deleteEvent(e.id)}>
                    <i className="icon-[ic--baseline-delete-forever] text-rose-500 h-6 w-6" aria-hidden="true"></i>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex justify-end mt-4">
        <Link href="/create-event">
          <Button className="w-48 bg-basic-blue text-white hover:bg-basic-blue">Create Event</Button>
        </Link>
      </div>
    </div>
  );
}
