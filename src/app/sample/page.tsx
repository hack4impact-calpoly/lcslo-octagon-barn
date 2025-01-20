"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Sample() {
  const router = useRouter();

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <Button
        variant="outline"
        onClick={() => router.push("/")} // Navigate to home page
      >
        Home
      </Button>
    </main>
  );
}
