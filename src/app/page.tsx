"use client";

import { useUser } from "@clerk/nextjs";
import AdminEventDashboard from "@/components/AdminEventDashboard";

export default function Home() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return null;

  console.log("user:", user);

  const isAdmin = user?.publicMetadata?.isAdmin === true;

  return (
    <main className="p-6">
      {isAdmin ? <AdminEventDashboard /> : <p className="text-center text-gray-500"> Client home placeholder</p>}
    </main>
  );
}
