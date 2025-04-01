"use client";

import React, { useState, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface FormValues {
  firstName: string;
  lastName: string;
  organization: string;
  email: string;
  password: string;
}

const SignUpPage: React.FC = () => {
  const router = useRouter();

  const [formValues, setFormValues] = useState<FormValues>({
    firstName: "",
    lastName: "",
    organization: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormValues> = {};

    if (!formValues.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formValues.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formValues.organization.trim()) newErrors.organization = "Organization is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formValues.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formValues.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formValues.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formValues.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 409) {
          setApiError("User already exists. Please sign in instead.");
        } else {
          setApiError(result.error || "Failed to create user");
        }
        throw new Error(result.error);
      }

      router.push("/");
    } catch (error: any) {
      console.error("Sign up error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/auth_background.png" alt="Background" fill className="object-cover filter blur-sm" />
      </div>

      <div className="relative flex items-center justify-center min-h-[85vh]">
        <div className="bg-white/80 shadow-lg rounded-lg p-8 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-basic-blue">Create Account</h2>

          {apiError && <p className="text-red-500 text-center">{apiError}</p>}

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4" noValidate>
            <div className="col-span-1">
              <label className="block mb-1 font-medium text-basic-blue">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${
                  errors.firstName ? "border-red-500" : "border-sky-600"
                } focus:outline-none focus:border-sky-500`}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            <div className="col-span-1">
              <label className="block mb-1 font-medium text-basic-blue">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${
                  errors.lastName ? "border-red-500" : "border-sky-600"
                } focus:outline-none focus:border-sky-500`}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>

            <div className="col-span-2">
              <label className="block mb-1 font-medium text-basic-blue">Organization</label>
              <input
                type="text"
                name="organization"
                value={formValues.organization}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${
                  errors.organization ? "border-red-500" : "border-sky-600"
                } focus:outline-none focus:border-sky-500`}
              />
              {errors.organization && <p className="text-red-500 text-sm mt-1">{errors.organization}</p>}
            </div>

            <div className="col-span-2">
              <label className="block mb-1 font-medium text-basic-blue">Email Address</label>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${
                  errors.email ? "border-red-500" : "border-sky-600"
                } focus:outline-none focus:border-sky-500`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="col-span-2">
              <label className="block mb-1 font-medium text-basic-blue">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${
                    errors.password ? "border-red-500" : "border-sky-600"
                  } focus:outline-none focus:border-sky-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-2 text-sm text-sky-600 hover:text-sky-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="col-span-2 mt-2 text-center">
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 bg-basic-blue text-white py-2 rounded hover:bg-sky-800 transition-colors"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
