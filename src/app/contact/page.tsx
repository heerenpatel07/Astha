"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import styles from "./page.module.css";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [address, setAddress] = useState("7 no Rudra industrial estate behind panchratna estate near ramol overbridge gidc phase 4 vatva ahmedabad");
  const [phone, setPhone] = useState("+91 7600969878");
  const [email, setEmail] = useState("info@aasthasteel.com");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.address) setAddress(data.address);
          if (data.phone) setPhone(data.phone);
          if (data.email) setEmail(data.email);
        }
      } catch (err) {
        console.error("Failed to load contact settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const mapEmbedUrl = address ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed` : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending email
    setTimeout(() => {
      setSent(true);
    }, 1000);
  };

  return (
    <>
      <div className={styles.contactHeader}>
        <div className="container">
          <h1 className={styles.title}>Contact <span className="text-gradient-accent">Us</span></h1>
        </div>
      </div>

      <section className="container" style={{ marginBottom: mapEmbedUrl ? "0" : "80px" }}>
        <div className={styles.contactGrid}>
          {/* Info Side */}
          <div className={styles.infoCard}>
            <h3 style={{ marginBottom: '30px', color: 'var(--metallic-silver)', fontSize: '1.8rem' }}>Get In Touch</h3>
            
            {address && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><MapPin size={24} /></div>
                <div className={styles.infoText}>
                  <h4>Head Office & Factory</h4>
                  <p><a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e => (e.currentTarget.style.color = 'var(--accent-orange)')} onMouseOut={e => (e.currentTarget.style.color = 'inherit')}>{address}</a></p>
                </div>
              </div>
            )}

            {phone && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Phone size={24} /></div>
                <div className={styles.infoText}>
                  <h4>Call Us Directly</h4>
                  <p><a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e => (e.currentTarget.style.color = 'var(--accent-orange)')} onMouseOut={e => (e.currentTarget.style.color = 'inherit')}>{phone}</a></p>
                </div>
              </div>
            )}

            {email && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Mail size={24} /></div>
                <div className={styles.infoText}>
                  <h4>Email Address</h4>
                  <p><a href={`mailto:${email}`} style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e => (e.currentTarget.style.color = 'var(--accent-orange)')} onMouseOut={e => (e.currentTarget.style.color = 'inherit')}>{email}</a></p>
                </div>
              </div>
            )}
          </div>

          {/* Form Side */}
          <div className={styles.formCard}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <h3 className="text-gradient-accent" style={{ marginBottom: '15px' }}>Message Sent Successfully!</h3>
                <p style={{ color: 'var(--text-muted)' }}>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button className="btn btn-outline" style={{ marginTop: '20px' }} onClick={() => setSent(false)}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div className={styles.formGroup}>
                    <label>Full Name</label>
                    <input type="text" className={styles.input} required placeholder="John Doe" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone Number</label>
                    <input type="tel" className={styles.input} required placeholder="+91 00000 00000" />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input type="email" className={styles.input} required placeholder="john@example.com" />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Project Details / Message</label>
                  <textarea className={styles.textarea} required placeholder="Tell us about your requirements..."></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px' }}>
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Dynamic Google Map Embed */}
      {mapEmbedUrl && (
        <section className="container animate-fadeIn" style={{ marginTop: '50px', marginBottom: '80px' }}>
          <div className="glass-card" style={{ padding: '10px', overflow: 'hidden', height: '400px', display: 'block', transition: 'var(--transition)' }}>
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: 'var(--border-radius)' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      )}
    </>
  );
}
