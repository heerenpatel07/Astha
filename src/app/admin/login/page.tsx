"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ArrowRight, ShieldAlert } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(false);

    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Successful login
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Authentication failed");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "var(--bg-dark)",
      position: "relative",
      overflow: "hidden",
      padding: "20px"
    }}>
      {/* Background Glows */}
      <div style={{
        position: "absolute",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(242, 109, 33, 0.15) 0%, transparent 70%)",
        top: "20%",
        left: "20%",
        filter: "blur(50px)",
        pointerEvents: "none"
      }}></div>
      <div style={{
        position: "absolute",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0, 112, 243, 0.1) 0%, transparent 70%)",
        bottom: "20%",
        right: "20%",
        filter: "blur(60px)",
        pointerEvents: "none"
      }}></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "450px",
          padding: "40px 30px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          zIndex: 10
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <h2 style={{ fontSize: "1.8rem", letterSpacing: "2px", margin: "0" }}>
            AASTHA <span className="text-gradient-accent">STEEL</span>
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Admin Portal Access
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "rgba(255, 50, 50, 0.1)",
              border: "1px solid rgba(255, 50, 50, 0.3)",
              borderRadius: "var(--border-radius)",
              padding: "12px 15px",
              marginBottom: "25px",
              color: "#ff5252",
              fontSize: "0.9rem"
            }}
          >
            <ShieldAlert size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin}>
          <div className="admin-form-group" style={{ marginBottom: "25px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--metallic-silver)" }}>
              <Lock size={14} /> Admin Password
            </label>
            <input
              type="password"
              className="admin-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoFocus
              style={{
                marginTop: "8px",
                fontSize: "1.1rem",
                letterSpacing: "3px",
                textAlign: "center",
                padding: "14px"
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              fontSize: "1.05rem"
            }}
          >
            {loading ? "Authenticating..." : (
              <>
                Unlock Dashboard <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
