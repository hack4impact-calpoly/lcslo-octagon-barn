import Link from "next/link";
import { Button } from "@/components/ui/button"; //library for Button

export default function SamplePage() {
  return (
    <>
      <h1>this is the sample page for intro ramp up task.</h1>
      <Link href="/">
        <Button variant="outline">Button Back to Home</Button>
      </Link>
    </>
  );
}
