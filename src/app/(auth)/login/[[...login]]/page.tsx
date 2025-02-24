"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid w-full flex-grow items-center bg-zinc-100 px-4 sm:justify-center">
      <Image
        src="/auth_background.png"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 w-full h-full blur-md pointer-events-none"
      />
      <div className="absolute top-10 left-1/2 -translate-x-1/2">
        <Image
          src="/logo.png"
          alt="Logo"
          width={560}
          height={200}
          className="w-96 sm:w-[28rem] h-auto pointer-events-none"
        />
      </div>
      <div className="z-10 w-full">
        <SignIn.Root>
          <SignIn.Step
            name="start"
            className="w-full space-y-8 rounded-2xl px-6 py-12 shadow-lg ring-1 ring-black/5 sm:w-[32rem] sm:px-10 backdrop-blur-md bg-white/50"
          >
            <Clerk.GlobalError className="block text-sm text-red-400" />
            <div className="space-y-6">
              <Clerk.Field name="identifier" className="space-y-3">
                <Clerk.Label className="text-sm font-medium text-zinc-950">Username</Clerk.Label>
                <Clerk.Input
                  type="text"
                  required
                  className="w-full rounded-md bg-white px-4 py-3 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-2 focus:ring-zinc-950 data-[invalid]:ring-red-400"
                />
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>
              <Clerk.Field name="password" className="space-y-3">
                <Clerk.Label className="text-sm font-medium text-zinc-950">Password</Clerk.Label>
                <Clerk.Input
                  type="password"
                  required
                  className="w-full rounded-md bg-white px-4 py-3 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-2 focus:ring-zinc-950 data-[invalid]:ring-red-400"
                />
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>
            </div>
            <SignIn.Action
              submit
              className="w-full rounded-md bg-[var(--primary-blue)] px-4 py-2 text-center text-sm font-medium text-white shadow outline-none hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
            >
              Log in
            </SignIn.Action>
            <p className="text-center text-sm text-zinc-500">
              No account?{" "}
              <Clerk.Link
                navigate="sign-up"
                className="font-medium text-zinc-950 decoration-zinc-950/20 underline-offset-4 outline-none hover:text-zinc-700 hover:underline focus-visible:underline"
              >
                Create an account
              </Clerk.Link>
            </p>
          </SignIn.Step>
        </SignIn.Root>
      </div>
    </div>
  );
}
