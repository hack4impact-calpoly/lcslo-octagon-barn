"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/datetime-picker";

export default function CreateEventPage() {
  const router = useRouter();

  // State for form inputs
  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");
  const [numGuests, setNumGuests] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [eventDetails, setEventDetails] = useState("");
  const [vendorList, setVendorList] = useState(`- Coordinator: 
- Caterer:
- Bartender: 
- Rentals: 
- Photo/Video: 
- Florist: 
- DJ/Band: 
- Lighting/Draping: 
- Staffing: 
- Transportation: 
- Ice: 
- Other: `);
  const [user, setUser] = useState<{ name: string; email: string; id: string } | null>(null);

  // Validation state
  const [errors, setErrors] = useState({
    eventName: false,
    venue: false,
    numGuests: false,
    startDate: false,
    endDate: false,
    eventDetails: false,
    vendorList: false,
    user: false,
    invalidDateRange: false,
  });

  //preloads form data
  useEffect(() => {
    const savedForm = sessionStorage.getItem("eventForm");
    const assignedUser = sessionStorage.getItem("assignedUser");

    if (savedForm) {
      const parsedForm = JSON.parse(savedForm);
      setEventName(parsedForm.eventName || "");
      setVenue(parsedForm.venue || "");
      setNumGuests(parsedForm.numGuests || "");
      setStartDate(parsedForm.startDate ? new Date(parsedForm.startDate) : undefined);
      setEndDate(parsedForm.endDate ? new Date(parsedForm.endDate) : undefined);
      setEventDetails(parsedForm.eventDetails || "");
      setVendorList(parsedForm.vendorList || "");
    }

    if (assignedUser) {
      const parsedUser = JSON.parse(assignedUser);
      setUser({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        id: parsedUser.id || "",
      });
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for missing fields
    const newErrors = {
      eventName: eventName.trim() === "",
      venue: venue.trim() === "",
      numGuests: numGuests.trim() === "",
      startDate: !startDate,
      endDate: !endDate,
      eventDetails: eventDetails.trim() === "",
      vendorList: vendorList.trim() === "",
      user: !user || user.id.trim() === "",
      invalidDateRange: !!(startDate && endDate && startDate >= endDate),
    };

    setErrors(newErrors);

    // If there are any errors, stop form submission
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    let currentStatus = "Upcoming";
    const currentDate = Date.now();
    if (endDate && currentDate >= endDate?.getTime()) {
      currentStatus = "Completed";
    } else if (startDate && endDate && currentDate >= startDate?.getTime() && currentDate <= endDate?.getTime()) {
      currentStatus = "Ongoing";
    }

    // Submit the form if no errors
    try {
      const response = await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName,
          venue,
          eventDateStart: startDate,
          eventDateEnd: endDate,
          status: currentStatus,
          numGuests: parseInt(numGuests),
          clerkId: user?.id,
          clientName: user?.name,
          vendorList,
          eventDetails,
        }),
      });

      if (!response.ok) {
        console.error("Event creation failed:", await response.json());
        return;
      }

      sessionStorage.removeItem("eventForm");
      sessionStorage.removeItem("assignedUser");
      router.push("/");
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const saveFormToSession = () => {
    const form = {
      eventName,
      venue,
      numGuests,
      startDate,
      endDate,
      eventDetails,
      vendorList,
    };
    sessionStorage.setItem("eventForm", JSON.stringify(form));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white text-[var(--primary-blue)]  rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Create Event</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          name="eventName"
          className={`bg-[var(--primary-fill)] !text-lg placeholder:text-lg placeholder:text-[var(--primary-blue)] ${errors.eventName ? "border-red-500" : ""}`}
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />

        <div className="flex space-x-2">
          <Select key={venue} value={venue} onValueChange={(value) => setVenue(value)}>
            <SelectTrigger
              className={`w-1/2 bg-[var(--primary-fill)] text-lg data-[placeholder]:text-[var(--primary-blue)] data-[placeholder]:text-lg ${errors.venue ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Venue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="text-base" value="Full Facility">
                Full Facility
              </SelectItem>
              <SelectItem className="text-base" value="Octagon Barn & Plaza">
                Octagon Barn & Plaza
              </SelectItem>
              <SelectItem className="text-base" value="Shed & Courtyard">
                Shed & Courtyard
              </SelectItem>
              <SelectItem className="text-base" value="Milking Parlor">
                Milking Parlor
              </SelectItem>
              <SelectItem className="text-base" value="Other">
                Other
              </SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            name="numGuests"
            placeholder="Number of Guests"
            value={numGuests}
            onChange={(e) => setNumGuests(e.target.value)}
            className={`w-1/2 bg-[var(--primary-fill)] !text-lg placeholder:text-lg placeholder:text-[var(--primary-blue)] ${errors.numGuests ? "border-red-500" : ""}`}
          />
        </div>

        <div className="flex space-x-2">
          <DateTimePicker date={startDate} setDate={setStartDate} error={errors.startDate} />
          <DateTimePicker date={endDate} setDate={setEndDate} error={errors.endDate} />
        </div>

        {errors.invalidDateRange && <p className="text-red-500">End time must be after the start time.</p>}

        <div className="text-lg">Event Details:</div>
        <Textarea
          name="eventDetails"
          value={eventDetails}
          onChange={(e) => setEventDetails(e.target.value)}
          className={`h-32 bg-[var(--primary-fill)] !text-lg placeholder:text-lg placeholder:text-[var(--primary-blue)] ${errors.eventDetails ? "border-red-500" : ""}`}
        />

        <div className="text-lg">Vendor List:</div>
        <Textarea
          name="vendorList"
          value={vendorList}
          onChange={(e) => setVendorList(e.target.value)}
          className={`h-48 bg-[var(--primary-fill)] !text-lg placeholder:text-lg placeholder:text-[var(--primary-blue)] ${errors.vendorList ? "border-red-500" : ""}`}
        />

        <div className="text-lg">User:</div>
        <div
          className={`bg-[var(--primary-fill)] text-[var(--primary-blue)] text-lg rounded-md px-3 py-2 h-12 flex items-center placeholder:text-lg placeholder:text-[var(--primary-blue)] ${errors.user ? "border border-red-500" : ""}`}
        >
          {user ? (
            <div className="flex flex-col">
              <span>{user.name}</span>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
          ) : (
            <span className="text-[var(--primary-blue)">No User Assigned</span>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            type="button"
            className="w-1/2 bg-basic-blue hover:bg-hover-blue text-lg"
            onClick={() => {
              saveFormToSession();
              router.push("/assign-users");
            }}
          >
            Assign User
          </Button>
          <Button
            type="button"
            className="w-1/2 bg-basic-blue hover:bg-hover-blue text-lg"
            onClick={() => {
              saveFormToSession();
              router.push("/signup");
            }}
          >
            Create User
          </Button>
        </div>
        <div className="flex justify-end">
          <div className="flex  space-x-2 w-1/2 pl-1">
            <Button
              type="button"
              variant="destructive"
              className="w-1/2 text-lg bg-red-500 hover:bg-red-700"
              onClick={() => {
                sessionStorage.removeItem("eventForm");
                sessionStorage.removeItem("assignedUser");
                router.push("/");
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-1/2 bg-basic-blue hover:bg-hover-blue text-lg">
              Create Event
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
