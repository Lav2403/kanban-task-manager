import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "../App.css";

export default function Login() {
  const navigate = useNavigate();
  const { saveLogin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await api.post("/auth/login", { email, password });
      saveLogin(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="page-wrap" style={{ position: "relative" }}>
      {/* ✅ Glow layer so background looks more colorful */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(circle at 15% 20%, rgba(79,70,229,0.18), transparent 55%)," +
            "radial-gradient(circle at 85% 80%, rgba(6,182,212,0.16), transparent 60%)",
          pointerEvents: "none"
        }}
      />

      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        {/* ✅ HEADER */}
        <div
          style={{
            width: "100%",
            textAlign: "center",
            marginBottom: 22,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12
          }}
        >
          <div
            style={{
              padding: "14px 28px",
              borderRadius: 18,
              background: "linear-gradient(90deg, #4f46e5, #06b6d4, #22c55e)",
              boxShadow: "0 14px 40px rgba(0,0,0,0.18)",
              border: "1px solid rgba(255,255,255,0.35)"
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "38px",
                fontWeight: 900,
                letterSpacing: "0.04em",
                color: "white",
                textShadow: "0 4px 18px rgba(0,0,0,0.25)"
              }}
            >
              Kanban Task Manager
            </h1>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "#334155",
              fontWeight: 600
            }}
          >
            Organize tasks • Drag & Drop • Track progress easily 🚀
          </p>
        </div>

        {/* ✅ MAIN CARD */}
        <div className="glass-card" style={{ overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr"
            }}
          >
            {/* ✅ LEFT SIDE */}
            <div
              style={{
                padding: 26,
                background:
                  "linear-gradient(135deg, rgba(79,70,229,0.40), rgba(6,182,212,0.28))",
                borderRight: "1px solid rgba(255,255,255,0.35)",
                minHeight: 420
              }}
            >
              <h2
                style={{
                  margin: "0 0 8px",
                  fontSize: 42,
                  lineHeight: 1.1,
                  fontWeight: 900,
                  color: "#0f172a"
                }}
              >
                Plan. Track. Finish.
              </h2>

              <p
                style={{
                  margin: 0,
                  maxWidth: 420,
                  color: "#1e293b",
                  opacity: 0.92,
                  fontSize: 15
                }}
              >
                ✅ Login and manage tasks with a smooth drag-and-drop workflow.
              </p>

              {/* ✅ Illustration Box */}
              <div
                style={{
                  marginTop: 22,
                  height: 220,
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.32)",
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.10)"
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 54 }}>🗂️</div>
                  <h4 style={{ margin: "8px 0 4px", color: "#0f172a" }}>
                    Organize your work visually
                  </h4>
                  <p style={{ margin: 0, fontSize: 13, color: "#334155" }}>
                    Pending → In Progress → Completed
                  </p>
                </div>
              </div>

              {/* ✅ Feature chips */}
              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap"
                }}
              >
                <span className="badge">✅ JWT Auth</span>
                <span className="badge">⚡ Fast API</span>
                <span className="badge">🎯 Drag & Drop</span>
              </div>
            </div>

            {/* ✅ RIGHT SIDE FORM (UPDATED ✅) */}
            <div
              style={{
                padding: 26,
                background: "rgba(255,255,255,0.22)",
                backdropFilter: "blur(16px)",
                borderLeft: "1px solid rgba(255,255,255,0.25)"
              }}
            >
              <h2 style={{ marginTop: 0, fontSize: 28, color: "#0f172a" }}>
                Welcome back 👋
              </h2>

              <p style={{ marginTop: 6, color: "#475569" }}>
                Login to continue to your dashboard.
              </p>

              {errorMsg && (
                <p style={{ color: "#dc2626", marginTop: 10, fontWeight: 600 }}>
                  {errorMsg}
                </p>
              )}

              <form onSubmit={onLogin} style={{ marginTop: 14 }}>
                <label style={{ fontSize: 13, color: "#334155" }}>Email</label>
                <input
                  className="field"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ marginTop: 6, marginBottom: 12 }}
                />

                <label style={{ fontSize: 13, color: "#334155" }}>
                  Password
                </label>
                <input
                  className="field"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ marginTop: 6, marginBottom: 14 }}
                />

                <button className="btn-primary" type="submit">
                  Login
                </button>
              </form>

              <p style={{ marginTop: 14, color: "#334155", fontSize: 14 }}>
                New user?{" "}
                <Link to="/signup" style={{ fontWeight: 700, color: "#4f46e5" }}>
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* ✅ Mobile Responsive */}
        <style>
          {`
            @media (max-width: 900px) {
              .glass-card > div {
                grid-template-columns: 1fr !important;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}
