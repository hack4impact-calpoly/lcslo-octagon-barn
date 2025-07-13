"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useMemo } from "react";
import { useState as useReactState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner, UnauthorizedState } from "@/components/loadingStates";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Pagination as Pager,
  PaginationPrevious,
  PaginationNext,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface EventRow {
  clerkId: string;
  clientName: string;
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
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const stored = sessionStorage.getItem("currentPage");
    return stored ? parseInt(stored, 10) : 1;
  });
  const pageSize = 10;

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

    async function fetchEventsAndNames() {
      const res = await fetch("/api/event");
      const json = (await res.json()) as { data: EventRow[] } | EventRow[];
      const list: EventRow[] = Array.isArray(json) ? json : json.data;
      setEvents(list);
      setLoading(false);
    }

    fetchEventsAndNames();
  }, [isLoaded, isAdmin]);

  const filtered = useMemo<EventRow[]>(() => {
    let result = events.filter((e) => e.eventName.toLowerCase().includes(searchTerm.toLowerCase()));

    const statusOrder = ["Upcoming", "Ongoing", "Completed", "Cancelled"];
    if (!sortConfig) {
      result = [...result].sort((a, b) => {
        const statusDiff = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        if (statusDiff !== 0) return statusDiff;
        return new Date(a.eventDateStart).getTime() - new Date(b.eventDateStart).getTime();
      });
      return result;
    }

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
      return result;
    }
    return result;
  }, [events, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    sessionStorage.setItem("currentPage", page.toString());
  };

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      handlePageChange(1);
    }
  }, [totalPages, currentPage]);

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
    return <LoadingSpinner />;
  }
  if (!isAdmin) {
    return <UnauthorizedState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center text-3xl text-[var(--primary-blue)] rounded-l font-bold mb-4">
        Events
      </div>
      <div>
        {loading ? (
          <LoadingSpinner />
        ) : paginated.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No events found</p>
        ) : (
          <div>
            <div className="flex items-center">
              <Input
                placeholder="Search for an event"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                className="max-w-sm py-2 md:text-sm placeholder:text-sm ml-auto"
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer text-center text-sm text-black"
                    onClick={() => requestSort("eventName")}
                  >
                    Event Name {sortConfig?.key === "eventName" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                  </TableHead>
                  <TableHead className="cursor-pointer text-center text-sm text-black">Client Name</TableHead>
                  <TableHead
                    className="cursor-pointer text-center text-sm text-black"
                    onClick={() => requestSort("eventDateStart")}
                  >
                    Start Date{" "}
                    {sortConfig?.key === "eventDateStart" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                  </TableHead>
                  <TableHead
                    className="text-center cursor-pointer text-sm text-black"
                    onClick={() => requestSort("status")}
                  >
                    Status {sortConfig?.key === "status" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                  </TableHead>
                  <TableHead className="text-center text-sm text-black">View</TableHead>
                  <TableHead className="text-center text-sm text-black">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="!text-center text-sm">{e.eventName ?? "No Event Name"}</TableCell>
                    <TableCell className="!text-center text-sm">{e.clientName ?? "No Client Name"}</TableCell>
                    <TableCell className="!text-center text-sm">
                      {new Date(e.eventDateStart).toLocaleString()}
                    </TableCell>
                    <TableCell className="!text-center">
                      <Select value={e.status} onValueChange={(val) => updateStatus(e.id, val as EventRow["status"])}>
                        <SelectTrigger className="mx-auto justify-center text-sm">
                          <SelectValue className="text-center" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Upcoming", "Ongoing", "Completed", "Cancelled"].map((s) => (
                            <SelectItem key={s} value={s} className="text-sm">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="!text-center">
                      <Link
                        href={`/view/event/${e.id}`}
                        className="bg-basic-blue text-white text-sm hover:bg-hover-blue px-4 py-2 rounded-full whitespace-nowrap inline-block"
                      >
                        View Event
                      </Link>
                    </TableCell>
                    {e.status !== "Completed" && e.status !== "Cancelled" ? (
                      <TableCell className="!text-center">
                        <Button variant="ghost" size="icon" onClick={() => deleteEvent(e.id)}>
                          <i
                            className="icon-[ic--baseline-delete-forever] text-rose-500 h-6 w-6"
                            aria-hidden="true"
                          ></i>
                        </Button>
                      </TableCell>
                    ) : (
                      <TableCell className="!text-center">
                        <i className="icon-[ic--baseline-delete-forever] text-gray-500 h-6 w-6" aria-hidden="true"></i>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end mt-4">
              <Link href="/create-event">
                <Button className="px-10 py-6 text-base bg-basic-blue text-white hover:bg-hover-blue rounded-full">
                  Create Event
                </Button>
              </Link>
            </div>
            <div className="flex justify-center mt-4">
              {filtered.length > 0 && (
                <Pager>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    aria-disabled={currentPage === 1}
                    className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                  >
                    Previous
                  </PaginationPrevious>
                  <PaginationContent>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        {page === currentPage ? (
                          <PaginationLink isActive>{page}</PaginationLink>
                        ) : page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1 ? (
                          <PaginationLink onClick={() => handlePageChange(page)}>{page}</PaginationLink>
                        ) : page === currentPage - 2 || page === currentPage + 2 ? (
                          <PaginationEllipsis />
                        ) : null}
                      </PaginationItem>
                    ))}
                  </PaginationContent>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    aria-disabled={currentPage === totalPages}
                    className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                  />
                </Pager>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
