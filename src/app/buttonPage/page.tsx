import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SamplePage() {
  return (
    <>
        <h1>Go Home</h1>
        <Button asChild>
            <Link href="/">Press Me</Link>
        </Button>
    </>
  );
}