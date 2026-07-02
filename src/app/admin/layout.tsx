"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Wrench, Image as ImageIcon, LogOut, Loader2 } from "lucide-react";
import "./admin.css"; // Admin specific styles

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/check-auth");
        if (res.ok) {
          setAuthenticated(true);
        } else {
          router.push("/admin/login");
        }
      } catch (err) {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (err) {
      alert("Failed to logout");
    }
  };

  // If it's the login page, bypass the layout checks and sidebar completely
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading spinner during initial authentication check
  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "var(--bg-dark)",
        color: "var(--text-main)",
        gap: "15px"
      }}>
        <Loader2 size={40} style={{ color: "var(--accent-orange)", animation: "spin 1.5s linear infinite" }} />
        <span style={{ fontFamily: "Oswald", letterSpacing: "1px", textTransform: "uppercase" }}>Verifying Authorization...</span>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If not authenticated (and loading is done), don't show the layout while router redirects
  if (!authenticated) {
    return null;
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          AASTHA<span>STEEL</span>
        </div>
        
        <nav className="admin-nav">
          <Link href="/admin" className={`admin-nav-link ${pathname === '/admin' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/services" className={`admin-nav-link ${pathname === '/admin/services' ? 'active' : ''}`}>
            <Wrench size={20} /> Manage Services
          </Link>
          <Link href="/admin/gallery" className={`admin-nav-link ${pathname === '/admin/gallery' ? 'active' : ''}`}>
            <ImageIcon size={20} /> Manage Gallery
          </Link>
        </nav>

        <div className="admin-footer">
          <button 
            onClick={handleLogout} 
            className="admin-nav-link" 
            style={{ 
              width: "100%", 
              background: "none", 
              border: "none", 
              textAlign: "left", 
              cursor: "pointer",
              padding: "10px 25px",
              color: "#ff5252"
            }}
          >
            <LogOut size={18} style={{ color: "#ff5252" }} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
