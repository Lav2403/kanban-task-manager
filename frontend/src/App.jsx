import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import KanbanBoard from "./pages/KanbanBoard";
import Profile from "./pages/Profile";

// ✅ Check token
function hasToken() {
  return Boolean(localStorage.getItem("token"));
}

// ✅ Protect pages that require login
function ProtectedRoute({ children }) {
  if (!hasToken()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ✅ Prevent logged-in users from going back to login/signup
function PublicRoute({ children }) {
  if (hasToken()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// ✅ Not Found Page
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-10 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-900">404 - Page Not Found</h2>
        <p className="text-gray-600 mt-3">
          The page you are looking for doesn’t exist.
        </p>

        <a
          href="/"
          className="inline-block mt-6 px-6 py-3 rounded-xl text-white font-semibold
          bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 transition"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {/* ✅ IMPORTANT: This wrapper ensures NO WHITE BACKGROUND LAYER */}
      <div className="min-h-screen w-full bg-transparent">
        <Routes>
          {/* ✅ Home Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <KanbanBoard />
              </ProtectedRoute>
            }
          />

          {/* ✅ Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ✅ Signup */}
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* ✅ Login */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* ✅ Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
