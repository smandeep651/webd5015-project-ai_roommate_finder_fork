"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { passwordSchema } from "../../../lib/validators";
import { z } from "zod";
import InputGroup from "../../../components/FormElements/InputGroup";
import { Checkbox } from "../../../components/FormElements/checkbox";
import Link from "next/link";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      const result = passwordSchema.safeParse(value);
      if (result.success) {
        setPasswordError("");
      } else {
        setPasswordError(result.error.errors[0].message);
      }
    }
  };

  const validate = () => {
    try {
      signupSchema.parse(formData);
      setErrors({ name: "", email: "", password: "", confirmPassword: "" });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = { name: "", email: "", password: "", confirmPassword: "" };
        error.errors.forEach((e) => {
          const field = e.path[0] as keyof typeof newErrors;
          newErrors[field] = e.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  useEffect(() => {
    const valid = validate();
    setIsFormValid(valid);
    if (!valid) setAgreeToTerms(false); 
  }, [formData]);  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
        try {
            const res = await fetch("/api/auth/sign-up", {
              method: 'POST',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            });
      
            const data = await res.json();
      
            if (!res.ok) throw new Error(data.message || "Signup failed.");
      
            router.push("/auth/sign-in");
        } catch (err: any) {
            setErrors(err.message);
        } finally {
            setLoading(false);
        }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* {Object.values(errors).some((error) => error) && (
        <div className="text-red-500 text-sm">
          <ul>
            {Object.values(errors).map((error, index) => (
              error && <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )} */}
      <InputGroup
        type="text"
        label="Name"
        className="mb-4"
        placeholder="Enter your full name"
        name="name"
        value={formData.name}
        handleChange={handleChange}
        error={errors.name}
      />
      <InputGroup
        type="email"
        label="Email"
        className="mb-4"
        placeholder="Enter your email"
        name="email"
        value={formData.email}
        handleChange={handleChange}
        error={errors.email}
      />

      <InputGroup
        type="password"
        label="Password"
        className="mb-4"
        placeholder="Enter your password"
        name="password"
        value={formData.password}
        handleChange={handleChange}
        error={passwordError || errors.password}
      />

      <InputGroup
        type="password"
        label="Confirm Password"
        className="mb-6"
        placeholder="Confirm your password"
        name="confirmPassword"
        value={formData.confirmPassword}
        handleChange={handleChange}
        error={errors.confirmPassword}
      />

      <div className="mb-4">
        <Checkbox 
            label="I agree to the terms and conditions" 
            name="terms" 
            disabled={!isFormValid}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
        />
      </div>

      <div className="flex justify-center mb-4">
        <button
          type="submit"
          disabled={!agreeToTerms}
          className={`w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 ${
          !agreeToTerms ? "cursor-not-allowed opacity-60" : "hover:bg-opacity-90"
        }`}
        >
          Sign Up
        </button>
      </div>
      <div className="text-sm text-center">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  );
}
