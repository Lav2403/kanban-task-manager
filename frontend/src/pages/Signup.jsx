import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "../App.css";

export default function Signup() {
  const navigate = useNavigate();
  const { saveLogin } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("⚠️ Please fill all fields.");
      return;
    }

    if (password.trim().length < 6) {
      setErrorMsg("⚠️ Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/signup", {
        name: name.trim(),
        email: email.trim(),
        password: password.trim()
      });
      saveLogin(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "❌ Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="glass-card">
        <div style={{ padding: 22, maxWidth: 520, margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <div className="badge" style={{ justifyContent: "center" }}>
              🚀 Create your account
            </div>

            <h2 style={{ margin: "12px 0 6px" }}>Start your task board</h2>
            <p style={{ margin: 0, color: "#64748b" }}>
              Signup to create tasks and move them using drag & drop.
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                marginTop: 14,
                padding: 10,
                borderRadius: 12,
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                color: "#b91c1c"
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={onSignup} style={{ marginTop: 14 }}>
            <label style={{ fontSize: 13, color: "#334155" }}>Full Name</label>
            <input
              className="field"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ marginTop: 6, marginBottom: 12 }}
            />

            <label style={{ fontSize: 13, color: "#334155" }}>Email</label>
            <input
              className="field"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginTop: 6, marginBottom: 12 }}
            />

            <label style={{ fontSize: 13, color: "#334155" }}>Password</label>
            <input
              className="field"
              placeholder="Min 6 characters"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginTop: 6, marginBottom: 14 }}
            />

            <button className="btn-primary" disabled={loading}>
              {loading ? "Creating account..." : "Signup"}
            </button>
          </form>

          <p style={{ marginTop: 12, color: "#475569", textAlign: "center" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ fontWeight: 800 }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
