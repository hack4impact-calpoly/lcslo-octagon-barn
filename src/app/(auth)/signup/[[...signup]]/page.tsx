"use client";

import React, { useState, FormEvent } from "react";
import Image from "next/image";

interface FormValues {
  firstName: string;
  lastName: string;
  organization: string;
  email: string;
  password: string;
}

const SignUpPage: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    firstName: "",
    lastName: "",
    organization: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false); // SHOW PASSWORD STATE

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormValues> = {};

    if (!formValues.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formValues.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formValues.organization.trim()) {
      newErrors.organization = "Organization is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formValues.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!emailRegex.test(formValues.email)) {
      newErrors.email = "Invalid Email Address format";
    }

    if (!formValues.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // replace with actual functionality?
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
      setFormValues({
        firstName: "",
        lastName: "",
        organization: "",
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/octagon_barn_background.jpg" alt="Background" fill className="object-cover filter blur-sm" />
      </div>

      <div className="relative flex items-center justify-center min-h-[85vh]">
        <div className="bg-white/80 shadow-lg rounded-lg p-8 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-sky-700">Create Account</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4" noValidate>
            <div className="col-span-1">
              <label htmlFor="firstName" className="block mb-1 font-medium text-sky-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
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
              <label htmlFor="lastName" className="block mb-1 font-medium text-sky-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
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
              <label htmlFor="organization" className="block mb-1 font-medium text-sky-700">
                Organization
              </label>
              <input
                type="text"
                id="organization"
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
              <label htmlFor="email" className="block mb-1 font-medium text-sky-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
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
              <label htmlFor="password" className="block mb-1 font-medium text-sky-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${
                    errors.password ? "border-red-500" : "border-sky-600"
                  } focus:outline-none focus:border-sky-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-2 text-sm text-sky-600 hover:text-sky-800 focus:outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="col-span-2 mt-2">
              <p className="text-center">
                <button
                  type="submit"
                  className="w-1/2 bg-sky-700 text-white py-2 rounded hover:bg-sky-800 transition-colors"
                >
                  Create Account
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
