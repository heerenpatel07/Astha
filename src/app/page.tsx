"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Wrench, ShieldCheck, Factory, ArrowRight } from "lucide-react";
import styles from "./page.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={`container ${styles.heroContent}`}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 variants={fadeUp} className={styles.heroTitle}>
              PRECISION ENGINEERED.<br />
              <span className="text-gradient-accent">BUILT TO LAST.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className={styles.heroSubtitle}>
              We deliver industrial-grade steel fabrication and commercial construction solutions.
              From blueprint to final weld, we forge excellence.
            </motion.p>
            <motion.div variants={fadeUp} className={styles.heroButtons}>
              <Link href="/services" className="btn btn-primary">
                Explore Services <ArrowRight size={18} style={{ marginLeft: "8px" }} />
              </Link>
              <Link href="/contact" className="btn btn-outline">
                Request a Quote
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Services Overview */}
      <section className="section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            style={{ textAlign: "center", marginBottom: "40px" }}
          >
            <h2>Our Core <span className="text-gradient">Capabilities</span></h2>
            <p style={{ color: "var(--text-muted)", marginTop: "10px" }}>
              Comprehensive steel solutions tailored for commercial demands.
            </p>
          </motion.div>

          <motion.div
            className={styles.servicesGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              {
                title: "Structural Steel",
                icon: <Factory size={48} />,
                desc: "Heavy-duty structural frameworks for commercial buildings and industrial facilities."
              },
              {
                title: "Custom Fabrication",
                icon: <Wrench size={48} />,
                desc: "Precision cutting, bending, and assembling of specialized metal structures."
              },
              {
                title: "Quality Assurance",
                icon: <ShieldCheck size={48} />,
                desc: "Rigorous testing and inspection guaranteeing safety and compliance."
              }
            ].map((service, index) => (
              <motion.div key={index} variants={fadeUp} className={`glass-card ${styles.serviceCard}`}>
                <div className={styles.serviceIcon}>{service.icon}</div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDesc}>{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={styles.ctaTitle}>Ready to start your next project?</h2>
            <p style={{ color: "var(--metallic-silver)", marginBottom: "30px" }}>
              Contact our engineering team today for a comprehensive consultation.
            </p>
            <Link href="/contact" className="btn btn-primary" style={{ padding: "12px 30px", fontSize: "1.05rem" }}>
              Get in Touch Now
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
