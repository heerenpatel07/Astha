"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  const pathname = usePathname();
  
  const [companyName, setCompanyName] = useState("Aastha Steel and Profile");
  const [logoUrl, setLogoUrl] = useState("");
  const [desc, setDesc] = useState("Premium commercial steel and fabrication services. Built for strength, designed for the future.");
  const [phone, setPhone] = useState("+91 7600969878");
  const [email, setEmail] = useState("info@aasthasteel.com");
  const [address, setAddress] = useState("7 no Rudra industrial estate behind panchratna estate near ramol overbridge gidc phase 4 vatva ahmedabad");
  const [gstNumber, setGstNumber] = useState("24AKXPP2484N1Z7");
  const [socials, setSocials] = useState<Record<string, string>>({
    whatsapp: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    youtube: ""
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.company_name) setCompanyName(data.company_name);
          if (data.logo_url) setLogoUrl(data.logo_url);
          if (data.seo_description) setDesc(data.seo_description);
          if (data.phone) setPhone(data.phone);
          if (data.email) setEmail(data.email);
          if (data.address) setAddress(data.address);
          if (data.gst_number !== undefined) setGstNumber(data.gst_number);
          
          setSocials({
            whatsapp: data.social_whatsapp || "",
            facebook: data.social_facebook || "",
            instagram: data.social_instagram || "",
            linkedin: data.social_linkedin || "",
            twitter: data.social_twitter || "",
            youtube: data.social_youtube || ""
          });
        }
      } catch (err) {
        console.error("Failed to load footer settings:", err);
      }
    };
    fetchSettings();
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col">
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
          <p className="footer-desc">
            {desc}
          </p>
          <div className="social-links">
            {socials.whatsapp && (
              <a href={socials.whatsapp} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="WhatsApp">
                <MessageCircle size={20} />
              </a>
            )}
            {socials.facebook && (
              <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            )}
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            )}
            {socials.youtube && (
              <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/></svg>
              </a>
            )}
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Contact Us</h4>
          <ul className="footer-contact">
            {address && (
              <li>
                <MapPin size={18} className="contact-icon" style={{ flexShrink: 0 }} />
                <a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e => (e.currentTarget.style.color = 'var(--accent-orange)')} onMouseOut={e => (e.currentTarget.style.color = 'inherit')}>{address}</a>
              </li>
            )}
            {phone && (
              <li>
                <Phone size={18} className="contact-icon" style={{ flexShrink: 0 }} />
                <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e => (e.currentTarget.style.color = 'var(--accent-orange)')} onMouseOut={e => (e.currentTarget.style.color = 'inherit')}>{phone}</a>
              </li>
            )}
            {email && (
              <li>
                <Mail size={18} className="contact-icon" style={{ flexShrink: 0 }} />
                <a href={`mailto:${email}`} style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e => (e.currentTarget.style.color = 'var(--accent-orange)')} onMouseOut={e => (e.currentTarget.style.color = 'inherit')}>{email}</a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved. {gstNumber ? `| GST: ${gstNumber}` : ""}</p>
      </div>
    </footer>
  );
}
