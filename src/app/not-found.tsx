"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen text-center">
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-4xl font-bold mb-1">Page not found</h1>
        <p className="text-lg text-gray-600 mb-6">The page you are looking for cannot be found</p>{" "}
        <Link href="/">
          <Button className="bg-[#3A6F8F] text-white px-8 py-4 text-2xl rounded-lg">Return home</Button>
        </Link>
      </div>
    </div>
  );
}
