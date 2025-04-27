"use client";

import React, { useState } from "react";
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
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
    console.log("Event Created:", { eventName, venue, numPeople, startDate, endDate, eventDetails, user });
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
              <SelectItem value="venue1">Venue 1</SelectItem>
              <SelectItem value="venue2">Venue 2</SelectItem>
              <SelectItem value="venue3">Venue 3</SelectItem>
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
          <Button type="button" className="w-1/2 bg-[var(--primary-blue)] text-lg">
            Assign User
          </Button>
          <Button type="button" className="w-1/2 bg-[var(--primary-blue)] text-lg">
            Create User
          </Button>
        </div>
        <div className="flex justify-end">
          <div className="flex  space-x-2 w-1/2 pl-1">
            <Button type="button" variant="destructive" className="w-1/2 text-lg" onClick={() => router.push("/")}>
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
