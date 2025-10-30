import React, { useState, useRef, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "",
    phone: "" 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", form);
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      nameInputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md">
        <header className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Create Account
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Join ServiceDesk AI
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name */}
          <div>
            <label 
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name <span className="text-red-600" aria-label="required">*</span>
            </label>
            <input
              ref={nameInputRef}
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              className="w-full border border-gray-300 p-3 rounded-lg focus-ring smooth-transition text-base"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              disabled={loading}
              aria-required="true"
            />
          </div>

          {/* Email */}
          <div>
            <label 
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email <span className="text-red-600" aria-label="required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="your@email.com"
              className="w-full border border-gray-300 p-3 rounded-lg focus-ring smooth-transition text-base"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              disabled={loading}
              aria-required="true"
            />
          </div>

          {/* Phone */}
          <div>
            <label 
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+34 600 000 000"
              className="w-full border border-gray-300 p-3 rounded-lg focus-ring smooth-transition text-base"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label 
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password <span className="text-red-600" aria-label="required">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full border border-gray-300 p-3 rounded-lg focus-ring smooth-transition text-base"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              disabled={loading}
              minLength={6}
              aria-required="true"
              aria-describedby="password-requirements"
            />
            <p 
              id="password-requirements"
              className="text-xs text-gray-500 mt-1"
            >
              Minimum 6 characters
            </p>
          </div>

          {/* Error */}
          {error && (
            <div 
              role="alert"
              aria-live="polite"
              className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm"
            >
              <span className="sr-only">Error:</span>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 font-semibold smooth-transition focus-ring disabled:opacity-60"
            aria-busy={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            className="text-purple-600 hover:underline font-semibold focus-ring rounded px-1"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;