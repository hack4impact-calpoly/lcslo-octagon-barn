"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SamplePage() {
  const router = useRouter();

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50">
      <Button variant="outline" onClick={() => router.push("/")}>
        Home Page
      </Button>
    </main>
  );
}
