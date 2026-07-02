"use client";

import { useState, useEffect } from "react";
import { 
  Building, PhoneCall, Share2, Search, Save, 
  CheckCircle, AlertCircle, Loader2, Info, Plus
} from "lucide-react";

export default function AdminDashboard() {
  const [settings, setSettings] = useState<Record<string, string>>({
    company_name: "Aastha Steel and Profile",
    logo_url: "",
    gst_number: "24AKXPP2484N1Z7",
    phone: "+91 7600969878",
    email: "info@aasthasteel.com",
    address: "7 no Rudra industrial estate behind panchratna estate near ramol overbridge gidc phase 4 vatva ahmedabad",
    business_hours: "Mon - Sat: 9:00 AM - 6:00 PM",
    social_facebook: "",
    social_instagram: "",
    social_linkedin: "",
    social_twitter: "",
    social_youtube: "",
    social_whatsapp: "",
    seo_title: "Aastha Steel and Profile | Commercial Steel & Fabrication",
    seo_description: "Premium commercial steel and fabrication services."
  });

  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        // Merge fetched data into default template
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Site settings updated successfully!" });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ type: "error", text: "Failed to update settings. Please check server logs." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred while communicating with the database." });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        handleChange("logo_url", data.url);
      } else {
        alert("Failed to upload image. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file.");
    } finally {
      setUploadingLogo(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", gap: "12px" }}>
        <Loader2 size={32} style={{ color: "var(--accent-orange)", animation: "spin 1.5s linear infinite" }} />
        <span style={{ color: "var(--text-muted)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Loading Configs...</span>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "General & Branding", icon: <Building size={16} /> },
    { id: "contact", label: "Contact Details", icon: <PhoneCall size={16} /> },
    { id: "socials", label: "Social Media", icon: <Share2 size={16} /> },
    { id: "seo", label: "SEO & Metadata", icon: <Search size={16} /> }
  ];

  return (
    <div>
      {message && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          backgroundColor: message.type === "success" ? "rgba(0, 200, 83, 0.1)" : "rgba(255, 50, 50, 0.1)",
          border: `1px solid ${message.type === "success" ? "rgba(0, 200, 83, 0.3)" : "rgba(255, 50, 50, 0.3)"}`,
          color: message.type === "success" ? "#00c853" : "#ff5252",
          borderRadius: "var(--border-radius)",
          padding: "15px 20px",
          marginBottom: "20px",
          fontSize: "0.95rem"
        }}>
          {message.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs list */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        borderBottom: "1px solid var(--glass-border)",
        paddingBottom: "10px",
        overflowX: "auto"
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              background: activeTab === tab.id ? "rgba(242, 109, 33, 0.1)" : "none",
              border: "none",
              borderRadius: "var(--border-radius)",
              color: activeTab === tab.id ? "var(--accent-orange)" : "var(--text-muted)",
              cursor: "pointer",
              fontFamily: "Oswald",
              fontSize: "0.95rem",
              textTransform: "uppercase",
              transition: "var(--transition)",
              borderBottom: activeTab === tab.id ? "2px solid var(--accent-orange)" : "none",
              whiteSpace: "nowrap"
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-card">
        <form onSubmit={handleSave}>
          
          {/* TAB 1: GENERAL & BRANDING */}
          {activeTab === "general" && (
            <div>
              <div className="admin-form-group">
                <label>Company / Business Name</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  placeholder="e.g. Aastha Steel and Profile"
                  value={settings.company_name}
                  onChange={e => handleChange("company_name", e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Company Logo</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ position: "relative", width: "100%" }}>
                    <input
                      type="file"
                      id="logo-file-input"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor="logo-file-input"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 20px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px dashed var(--glass-border)",
                        borderRadius: "var(--border-radius)",
                        color: "var(--text-main)",
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.9rem",
                        transition: "var(--transition)",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                        e.currentTarget.style.borderColor = "var(--accent-orange)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                        e.currentTarget.style.borderColor = "var(--glass-border)";
                      }}
                    >
                      {uploadingLogo ? (
                        <>
                          <Loader2 size={16} style={{ animation: "spin 1.5s linear infinite" }} />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Plus size={16} />
                          Choose Logo Image File
                        </>
                      )}
                    </label>
                  </div>
                  
                  {settings.logo_url && (
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "15px", 
                      padding: "10px 15px", 
                      background: "rgba(255, 255, 255, 0.02)", 
                      borderRadius: "var(--border-radius)", 
                      border: "1px solid var(--glass-border)", 
                      width: "fit-content",
                      marginTop: "5px"
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={settings.logo_url} alt="Logo Preview" style={{ height: "35px", width: "auto", objectFit: "contain" }} />
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{settings.logo_url}</span>
                      <button 
                        type="button" 
                        onClick={() => handleChange("logo_url", "")} 
                        style={{ 
                          background: "none", 
                          border: "none", 
                          color: "#ff5252", 
                          cursor: "pointer", 
                          fontSize: "0.85rem",
                          fontWeight: "500",
                          fontFamily: "Inter, sans-serif"
                        }}
                      >
                        Remove Logo
                      </button>
                    </div>
                  )}
                  <small style={{ color: "var(--text-muted)", display: "block" }}>
                    Select an image file (PNG, JPG, WEBP, or SVG) from your computer. If empty, the website will display your company name as text.
                  </small>
                </div>
              </div>

              <div className="admin-form-group">
                <label>GST Number</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. 24AKXPP2484N1Z7"
                  value={settings.gst_number}
                  onChange={e => handleChange("gst_number", e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Business / Working Hours</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Mon - Sat: 9:00 AM - 6:00 PM"
                  value={settings.business_hours}
                  onChange={e => handleChange("business_hours", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT DETAILS */}
          {activeTab === "contact" && (
            <div>
              <div className="admin-form-group">
                <label>Contact Phone Number</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  placeholder="e.g. +91 7600969878"
                  value={settings.phone}
                  onChange={e => handleChange("phone", e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Contact Email Address</label>
                <input
                  type="email"
                  className="admin-input"
                  required
                  placeholder="e.g. info@aasthasteel.com"
                  value={settings.email}
                  onChange={e => handleChange("email", e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Physical Address</label>
                <textarea
                  className="admin-textarea"
                  required
                  placeholder="Enter the full factory/business address..."
                  value={settings.address}
                  onChange={e => handleChange("address", e.target.value)}
                ></textarea>
              </div>
            </div>
          )}

          {/* TAB 3: SOCIAL MEDIA LINKS */}
          {activeTab === "socials" && (
            <div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px", color: "var(--accent-orange)" }}>
                <Info size={16} />
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Specify full URLs (e.g. https://facebook.com/yourpage). Leave fields blank to hide icons on the website.</span>
              </div>

              <div className="admin-form-group">
                <label>WhatsApp Link / Number (Format: https://wa.me/91XXXXXXXXXX)</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="https://wa.me/917600969878"
                  value={settings.social_whatsapp}
                  onChange={e => handleChange("social_whatsapp", e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Facebook Profile/Page URL</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="https://facebook.com/..."
                  value={settings.social_facebook}
                  onChange={e => handleChange("social_facebook", e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Instagram Handle URL</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="https://instagram.com/..."
                  value={settings.social_instagram}
                  onChange={e => handleChange("social_instagram", e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>LinkedIn Page URL</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="https://linkedin.com/company/..."
                  value={settings.social_linkedin}
                  onChange={e => handleChange("social_linkedin", e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>X / Twitter Profile URL</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="https://x.com/..."
                  value={settings.social_twitter}
                  onChange={e => handleChange("social_twitter", e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>YouTube Channel URL</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="https://youtube.com/..."
                  value={settings.social_youtube}
                  onChange={e => handleChange("social_youtube", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 4: SEO & METADATA */}
          {activeTab === "seo" && (
            <div>
              <div className="admin-form-group">
                <label>SEO Meta Title</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  placeholder="Primary title that appears in browser tab and search engines"
                  value={settings.seo_title}
                  onChange={e => handleChange("seo_title", e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>SEO Meta Description</label>
                <textarea
                  className="admin-textarea"
                  required
                  placeholder="Short summary of the site content that search engines display under title links..."
                  value={settings.seo_description}
                  onChange={e => handleChange("seo_description", e.target.value)}
                ></textarea>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "20px", display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 30px"
              }}
            >
              {saving ? (
                <>
                  <Loader2 size={18} style={{ animation: "spin 1.5s linear infinite" }} />
                  Saving Configuration...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Settings
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
