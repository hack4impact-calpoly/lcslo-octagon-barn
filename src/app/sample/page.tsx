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
        height: "100vh",
      }}
    >
      <Button variant="secondary" onClick={() => router.push("/")}>
        To the home
      </Button>
    </main>
  );
}
