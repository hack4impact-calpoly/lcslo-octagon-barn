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
  const [numPeople, setNumPeople] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [eventDetails, setEventDetails] = useState("");
  const [user, setUser] = useState("");

  // Validation state
  const [errors, setErrors] = useState({
    eventName: false,
    venue: false,
    numPeople: false,
    startDate: false,
    endDate: false,
    eventDetails: false,
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
      setNumPeople(parsedForm.numPeople || "");
      setStartDate(parsedForm.startDate ? new Date(parsedForm.startDate) : undefined);
      setEndDate(parsedForm.endDate ? new Date(parsedForm.endDate) : undefined);
      setEventDetails(parsedForm.eventDetails || "");
    }

    if (assignedUser) {
      const parsedUser = JSON.parse(assignedUser);
      setUser(parsedUser.name || "");
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for missing fields
    const newErrors = {
      eventName: eventName.trim() === "",
      venue: venue.trim() === "",
      numPeople: numPeople.trim() === "",
      startDate: !startDate,
      endDate: !endDate,
      eventDetails: eventDetails.trim() === "",
      user: user.trim() === "",
      invalidDateRange: !!(startDate && endDate && startDate >= endDate),
    };

    setErrors(newErrors);

    // If there are any errors, stop form submission
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    // Submit the form if no errors
    try {
      const response = await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName,
          venue,
          eventType: "Wedding", //placeholder
          eventDateStart: startDate,
          eventDateEnd: endDate,
          status: "Upcoming",
          numPeople: parseInt(numPeople),
          clerkId: user,
        }),
      });

      if (!response.ok) {
        console.error("Event creation failed:", await response.json());
        return;
      }

      const data = await response.json();
      console.log("Event created:", data);

      sessionStorage.removeItem("eventFormData");
      router.push("/");
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const saveFormToSession = () => {
    const form = {
      eventName,
      venue,
      numPeople,
      startDate,
      endDate,
      eventDetails,
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
          <Select onValueChange={(value) => setVenue(value)}>
            <SelectTrigger
              className={`w-1/2 bg-[var(--primary-fill)] data-[placeholder]:text-[var(--primary-blue)]  ${errors.venue ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Venue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="The Octagon Barn">The Octagon Barn</SelectItem>
              <SelectItem value="The Milking Parlor">The Milking Parlor</SelectItem>
              <SelectItem value="The Shed and Courtyard">The Shed and Courtyard</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            name="numPeople"
            placeholder="Number of People"
            value={numPeople}
            onChange={(e) => setNumPeople(e.target.value)}
            className={`w-1/2 bg-[var(--primary-fill)] !text-lg placeholder:text-lg placeholder:text-[var(--primary-blue)] ${errors.numPeople ? "border-red-500" : ""}`}
          />
        </div>

        <div className="flex space-x-2">
          <DateTimePicker date={startDate} setDate={setStartDate} error={errors.startDate} />
          <DateTimePicker date={endDate} setDate={setEndDate} error={errors.endDate} />
        </div>

        {errors.invalidDateRange && <p className="text-red-500">End time must be after the start time.</p>}

        <Textarea
          name="eventDetails"
          placeholder="Event Details"
          value={eventDetails}
          onChange={(e) => setEventDetails(e.target.value)}
          className={`h-24 bg-[var(--primary-fill)] !text-lg placeholder:text-lg placeholder:text-[var(--primary-blue)] ${errors.eventDetails ? "border-red-500" : ""}`}
        />

        <Input
          name="user"
          className={`bg-[var(--primary-fill)] placeholder:text-[var(--primary-blue)] !text-lg placeholder:text-lg ${errors.user ? "border-red-500" : ""}`}
          placeholder="User"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />

        <div className="flex space-x-2">
          <Button
            type="button"
            className="w-1/2 bg-[var(--primary-blue)] text-lg"
            onClick={() => {
              saveFormToSession();
              router.push("/users");
            }}
          >
            Assign User
          </Button>
          <Button
            type="button"
            className="w-1/2 bg-[var(--primary-blue)] text-lg"
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
              className="w-1/2 text-lg"
              onClick={() => {
                sessionStorage.removeItem("eventForm");
                sessionStorage.removeItem("assignedUser");
                router.push("/");
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-1/2 bg-[var(--primary-blue)] text-lg">
              Create Event
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
