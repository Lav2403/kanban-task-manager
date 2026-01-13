import { useContext, useMemo, useState } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { token, user, saveLogin } = useContext(AuthContext);

  const headers = useMemo(() => {
    return { headers: { Authorization: `Bearer ${token}` } };
  }, [token]);

  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const updateProfile = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!name.trim()) {
      setMsg("⚠️ Name is required.");
      return;
    }

    try {
      await api.put(
        "/users/me",
        { name: name.trim(), password: password.trim() },
        headers
      );

      // ✅ Update localStorage user (keep login)
      const updatedUser = { ...user, name: name.trim() };
      saveLogin(token, updatedUser);

      setPassword("");
      setMsg("✅ Profile updated successfully!");
      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Profile update failed.");
      setTimeout(() => setMsg(""), 2000);
    }
  };

  const deleteProfile = async () => {
    const ok = confirm("Are you sure you want to delete your profile?");
    if (!ok) return;

    try {
      await api.delete("/users/me", headers);
      localStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      setMsg("❌ Could not delete profile.");
      setTimeout(() => setMsg(""), 2000);
    }
  };

  return (
    <div className="page-wrap">
      <div className="glass-card">
        <div className="card-inner">
          <h2 style={{ marginTop: 0 }}>👤 Profile Settings</h2>
          <p style={{ marginTop: 6, color: "#475569" }}>
            Update your name or change password.
          </p>

          {msg && <p style={{ marginTop: 10 }}>{msg}</p>}

          <form onSubmit={updateProfile} style={{ marginTop: 14 }}>
            <label style={{ fontSize: 13 }}>Name</label>
            <input
              className="field"
              style={{ marginTop: 6 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label style={{ fontSize: 13, marginTop: 12, display: "block" }}>
              New Password (optional)
            </label>
            <input
              className="field"
              style={{ marginTop: 6 }}
              type="password"
              value={password}
              placeholder="Min 6 characters"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn-primary" style={{ marginTop: 14 }}>
              Save Changes
            </button>
          </form>

          <button
            onClick={deleteProfile}
            style={{
              width: "100%",
              marginTop: 12,
              padding: 12,
              borderRadius: 14,
              border: "1px solid rgba(239,68,68,0.4)",
              background: "rgba(239,68,68,0.08)",
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            🗑️ Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}
