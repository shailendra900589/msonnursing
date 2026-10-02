import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { adminFetchContent, adminLogin, AUTH_KEY, ApiError } from "../api/client.js";
import "./admin.css";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expired = searchParams.get("expired") === "1";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_KEY);
    if (!token) {
      setCheckingSession(false);
      return;
    }
    adminFetchContent(token)
      .then(() => navigate("/admin", { replace: true }))
      .catch((err) => {
        localStorage.removeItem(AUTH_KEY);
        if (err instanceof ApiError && err.status === 401) {
          setError("Session expired. Please sign in again.");
        }
        setCheckingSession(false);
      });
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token } = await adminLogin(password);
      localStorage.setItem(AUTH_KEY, token);
      navigate("/admin", { replace: true });
    } catch (err) {
      const msg = err instanceof ApiError && err.status === 0 ? err.message : "Invalid password.";
      setError(msg === "Invalid password." ? `${msg} Default dev password: admin123` : msg);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="admin-login-page">
        <Helmet>
          <title>Mson CMS</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="admin-login-card admin-login-card--checking">
          <p>Checking session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      <Helmet>
        <title>Mson CMS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="admin-login-bg" aria-hidden />
      <form className="admin-login-card" onSubmit={submit}>
        <div className="admin-login-brand">
          <img src="/logo.png?v=2" alt="Mson Nursing Services" />
          <div>
            <h1>Mson CMS</h1>
            <p>Secure content management</p>
          </div>
        </div>

        {expired ? (
          <p className="admin-login-alert" role="alert">
            Your session expired. Sign in again to continue editing.
          </p>
        ) : null}

        <label className="admin-login-field">
          <span>
            <LockKeyhole size={16} aria-hidden /> Admin password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            autoFocus
          />
        </label>

        {error ? (
          <p className="admin-error" role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" className="admin-login-submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in to dashboard"}
        </button>

        <p className="admin-login-foot">
          <ShieldCheck size={14} aria-hidden /> Protected area · Changes publish to the live site
        </p>
        <Link to="/" className="admin-login-back">
          ← Back to website
        </Link>
      </form>
    </div>
  );
}
