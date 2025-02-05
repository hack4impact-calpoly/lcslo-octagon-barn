"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center">
      <SignIn />
    </div>
  );
}
