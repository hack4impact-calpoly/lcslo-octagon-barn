import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Testpage() {
  return (
    <div>
      <Button>
        <Link href="/">Click Me</Link>
      </Button>
    </div>
  );
}
