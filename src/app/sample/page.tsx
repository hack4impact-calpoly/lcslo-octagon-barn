"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Sample() {
  const router = useRouter();

  return (
    <main
      style={{
        alignItems: "center",
        justifyContent: "center",
        border: "0.25rem solid blue",
      }}
    >
      <Button variant="outline" onClick={() => router.push("/")}>
        Return to Home where the ugly border doesnt exist
      </Button>
    </main>
  );
}
