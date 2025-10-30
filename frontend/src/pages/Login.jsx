import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const { data } = await API.post("/auth/login", { email, password });
      
      // Guardar en localStorage (backup)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Guardar en Redux
      dispatch(setUser({ user: data.user, token: data.token }));
      
      // Navegar
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      emailInputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md">
        <header className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            ServiceDesk AI
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Sign in to your account
          </p>
        </header>

        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          <div>
            <label 
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email <span className="text-red-600" aria-label="required">*</span>
            </label>
            <input
              ref={emailInputRef}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="your@email.com"
              className="w-full border border-gray-300 p-3 rounded-lg focus-ring smooth-transition text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              aria-required="true"
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "email-error" : undefined}
            />
          </div>

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
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full border border-gray-300 p-3 rounded-lg focus-ring smooth-transition text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              aria-required="true"
              aria-invalid={error ? "true" : "false"}
            />
          </div>

          {error && (
            <div 
              id="email-error"
              role="alert"
              aria-live="polite"
              className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm"
            >
              <span className="sr-only">Error:</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-semibold smooth-transition focus-ring disabled:opacity-60 disabled:cursor-not-allowed"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="sr-only">Signing in, please wait</span>
                <span aria-hidden="true">Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline font-semibold focus-ring rounded px-1"
            onClick={() => navigate("/register")}
          >
            Sign up
          </button>
        </p>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xs font-semibold text-gray-700 mb-2">
            Test Accounts:
          </h2>
          <dl className="space-y-1 text-xs text-gray-600">
            <div>
              <dt className="sr-only">Standard User</dt>
              <dd>👤 <strong>User:</strong> standard@servicedesk.com / test123</dd>
            </div>
            <div>
              <dt className="sr-only">ServiceDesk Agent</dt>
              <dd>🛠️ <strong>ServiceDesk:</strong> servicedesk@servicedesk.com / servicedesk123</dd>
            </div>
            <div>
              <dt className="sr-only">Administrator</dt>
              <dd>⚙️ <strong>Admin:</strong> admin@servicedesk.com / admin123</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Login;