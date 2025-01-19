"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function KylePage() {
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/"); // Navigate to the home page
  };
  return (
    <>
      <h1>Kyle&apos;s Page</h1>
      <Button onClick={handleNavigation}>Click me</Button>
    </>
  );
}
