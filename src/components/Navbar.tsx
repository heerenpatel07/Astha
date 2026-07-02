"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import "./Navbar.css"; // We'll add this next

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [companyName, setCompanyName] = useState("AASTHA STEEL");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.company_name) setCompanyName(data.company_name);
          if (data.logo_url) setLogoUrl(data.logo_url);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`navbar ${scrolled ? "scrolled" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container nav-container">
        <Link href="/" className="logo" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={companyName} style={{ height: "35px", width: "auto", objectFit: "contain" }} />
          ) : (
            <>
              {companyName.includes(" ") ? (
                <>
                  {companyName.substring(0, companyName.lastIndexOf(" "))}{" "}
                  <span className="text-gradient-accent">{companyName.substring(companyName.lastIndexOf(" ") + 1)}</span>
                </>
              ) : (
                companyName
              )}
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/services" className="nav-link">Services</Link>
          <Link href="/gallery" className="nav-link">Gallery</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
        </nav>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.nav 
          className="mobile-nav"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Link href="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/services" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Services</Link>
          <Link href="/gallery" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
          <Link href="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
        </motion.nav>
      )}
    </motion.header>
  );
}
