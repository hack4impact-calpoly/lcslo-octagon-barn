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
      <Button variant="default" size="lg" onClick={() => router.push("/")}>
        Home
      </Button>
    </main>
  );
}
