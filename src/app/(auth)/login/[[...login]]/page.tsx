"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Image from "next/image";
import React, { useState } from "react";

export default function LoginPage() {
  const [rememberMe, setRememberMe] = useState(false);

    return (
    <div className="relative min-h-screen grid w-full flex-grow items-center bg-zinc-100 px-4 sm:justify-center">
      <Image
        src="/auth_background.png"
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        className="absolute inset-0 w-full h-full blur-md pointer-events-none"
      />

      <div className="absolute top-10 left-1/2 -translate-x-1/2">
        <Image
          src="/logo_clean.png"
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
            className="w-full space-y-8 rounded-2xl px-6 py-12 shadow-lg ring-1 ring-black/5 sm:w-[32rem] sm:px-10 backdrop-blur-md"
            style={{ backgroundColor: "rgba(255,255,255,0.86)" }}  // big box at 86% white
          >
            <Clerk.GlobalError className="block text-sm text-red-400" />

            <div className="space-y-6">
              <Clerk.Field name="identifier" className="space-y-3">
                <Clerk.Label className="text-lg font-medium text-[#3A6F8F]">
                  Email address
                </Clerk.Label>
                <Clerk.Input
                  type="email"
                  required
                  className="w-full rounded-md bg-white px-4 py-3 text-lg outline-none ring-1 ring-inset ring-[#3A6F8F] hover:ring-opacity-75 focus:ring-2 focus:ring-[#3A6F8F] data-[invalid]:ring-red-400"
                />
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>

              <Clerk.Field name="password" className="space-y-3">
                <Clerk.Label className="text-lg font-medium text-[#3A6F8F]">
                  Password
                </Clerk.Label>
                <Clerk.Input
                  type="password"
                  required
                  className="w-full rounded-md bg-white px-4 py-3 text-lg outline-none ring-1 ring-inset ring-[#3A6F8F] hover:ring-opacity-75 focus:ring-2 focus:ring-[#3A6F8F] data-[invalid]:ring-red-400"
                />
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-[#3A6F8F]">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#3A6F8F] text-[#3A6F8F] focus:ring-2 focus:ring-[#3A6F8F]"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <SignIn.Action
                  navigate="forgot-password"
                  className="text-sm text-[#B4B4B4] hover:underline"
                >
                  Forgot password?
                </SignIn.Action>
              </div>
            </div>

            <SignIn.Action
              submit
              className="w-full rounded-md bg-[#3A6F8F] px-4 py-2 text-center text-lg font-medium text-white shadow outline-none hover:bg-opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3A6F8F] active:opacity-80"
            >
              Log In
            </SignIn.Action>
          </SignIn.Step>

          <SignIn.Step
            name="verifications"
            className="w-full space-y-8 rounded-2xl px-6 py-12 shadow-lg ring-1 ring-black/5 sm:w-[32rem] sm:px-10 backdrop-blur-md bg-white/50"
          >
            <SignIn.Strategy name="password">
              <Clerk.Field name="password" className="space-y-3">
                <Clerk.Label className="text-lg font-medium text-zinc-950">
                  Password
                </Clerk.Label>
                <Clerk.Input
                  type="password"
                  required
                  className="w-full rounded-md bg-white px-4 py-3 text-lg outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-2 focus:ring-zinc-950 data-[invalid]:ring-red-400"
                />
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>
              <SignIn.Action
                submit
                className="w-full rounded-md bg-[var(--primary-blue)] px-4 py-2 text-center text-lg font-medium text-white shadow outline-none hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
              >
                Log In
              </SignIn.Action>
              <SignIn.Action navigate="forgot-password">Forgot password?</SignIn.Action>
            </SignIn.Strategy>

            <SignIn.Strategy name="reset_password_email_code">
              <h1>Check your email</h1>
              <p>
                We sent a code to <SignIn.SafeIdentifier />.
              </p>

              <Clerk.Field name="code" className="space-y-3">
                <Clerk.Label className="text-lg font-medium text-zinc-950">
                  Email Code
                </Clerk.Label>
                <Clerk.Input
                  className="w-full rounded-md bg-white px-4 py-3 text-lg outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-2 focus:ring-zinc-950 data-[invalid]:ring-red-400"
                />
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>

              <SignIn.Action
                submit
                className="w-full rounded-md bg-[var(--primary-blue)] px-4 py-2 text-center text-lg font-medium text-white shadow outline-none hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
              >
                Continue
              </SignIn.Action>
            </SignIn.Strategy>
          </SignIn.Step>

          <SignIn.Step
            name="forgot-password"
            className="w-full space-y-8 rounded-2xl px-6 py-12 shadow-lg ring-1 ring-black/5 sm:w-[32rem] sm:px-10 backdrop-blur-md bg-white/50"
          >
            <SignIn.SupportedStrategy name="reset_password_email_code">
              Click here to reset your password
            </SignIn.SupportedStrategy>

            <SignIn.Action
              navigate="previous"
              className="w-full rounded-md bg-[var(--primary-blue)] px-4 py-2 text-center text-lg font-medium text-white shadow outline-none hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
            >
              Go back
            </SignIn.Action>
          </SignIn.Step>

          <SignIn.Step
            name="reset-password"
            className="w-full space-y-8 rounded-2xl px-6 py-12 shadow-lg ring-1 ring-black/5 sm:w-[32rem] sm:px-10 backdrop-blur-md bg-white/50"
          >
            <Clerk.Field name="password">
              <Clerk.Label className="text-lg font-medium text-zinc-950">
                New password
              </Clerk.Label>
              <Clerk.Input
                className="w-full rounded-md bg-white px-4 py-3 text-lg outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-2 focus:ring-zinc-950 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError />
            </Clerk.Field>

            <Clerk.Field name="confirmPassword">
              <Clerk.Label className="text-lg font-medium text-zinc-950">
                Confirm password
              </Clerk.Label>
              <Clerk.Input
                className="w-full rounded-md bg-white px-4 py-3 text-lg outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-2 focus:ring-zinc-950 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError />
            </Clerk.Field>

            <SignIn.Action
              submit
              className="w-full rounded-md bg-[var(--primary-blue)] px-4 py-2 text-center text-lg font-medium text-white shadow outline-none hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
            >
              Reset password
            </SignIn.Action>
          </SignIn.Step>
        </SignIn.Root>
      </div>
    </div>
  );
}
