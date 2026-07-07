import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  let service = await prisma.service.findUnique({
    where: { slug }
  });

  // Fallback data if database is empty so the user can see the UI during dev
  if (!service) {
    const fallbacks = [
      {
        id: "1",
        name: "Structural Steel Fabrication",
        slug: "structural-steel",
        description: "Heavy-duty steel beams, columns, and trusses engineered for large commercial buildings, industrial warehouses, and architectural marvels. Our state-of-the-art facility ensures precise cuts and welds that meet the highest industry safety standards. We manage everything from procurement to final on-site delivery.",
        thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        active: true,
        order: 1,
        images: "[]",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Custom Metal Machining",
        slug: "custom-machining",
        description: "Precision CNC machining for bespoke metal components. Tolerances down to the micron for aerospace, automotive, and industrial applications. Our advanced equipment can handle complex geometries and rare alloys with unparalleled accuracy and efficiency.",
        thumbnail: "https://images.unsplash.com/photo-1565439390236-c4d3db2ad5bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        active: true,
        order: 2,
        images: "[]",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "Industrial Welding",
        slug: "industrial-welding",
        description: "Certified MIG, TIG, and Arc welding services. We provide structural integrity that withstands the most extreme commercial environments. Our welders are heavily certified and experienced in working with heavy plates, pipes, and complex structural nodes.",
        thumbnail: "https://images.unsplash.com/photo-1574681659220-4363f8e50b91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        active: true,
        order: 3,
        images: "[]",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    service = fallbacks.find(s => s.slug === slug) || null;
  }

  if (!service) {
    notFound();
  }

  let albumImages: string[] = [];
  try {
    if (service.images) {
      albumImages = JSON.parse(service.images);
    }
  } catch (e) {
    console.error("Failed to parse album images:", e);
  }

  return (
    <>
      <div className={styles.hero}>
        <div className="container">
          <Link href="/services" className={styles.backBtn}>
            <ArrowLeft size={18} /> Back to Services
          </Link>
          <h1 className={styles.title}>{service.name}</h1>
        </div>
      </div>

      <section className="container">
        <div className={styles.contentWrapper}>
          <div className={styles.imageContainer}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={service.thumbnail || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"} 
              alt={service.name} 
              className={styles.image}
            />
          </div>
          <div className={styles.details}>
            <h2>Service Details</h2>
            <br />
            <p>{service.description}</p>
            <br />
            <Link href="/contact" className="btn btn-primary">
              Request this Service
            </Link>
          </div>
        </div>
      </section>

      {albumImages.length > 0 && (
        <section className="container animate-fadeIn" style={{ marginTop: "40px", marginBottom: "80px" }}>
          <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: "2.2rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "25px", color: "var(--text-main)" }}>
            Service <span className="text-gradient">Album</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "25px" }}>
            {albumImages.map((imgUrl, index) => (
              <div 
                key={index} 
                className="glass-card" 
                style={{ 
                  padding: "10px", 
                  borderRadius: "var(--border-radius)", 
                  overflow: "hidden",
                  transition: "var(--transition)",
                  border: "1px solid var(--glass-border)",
                  background: "var(--bg-card)"
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imgUrl} 
                  alt={`${service.name} Album Image ${index + 1}`} 
                  style={{ 
                    width: "100%", 
                    height: "220px", 
                    objectFit: "cover", 
                    borderRadius: "4px",
                    display: "block" 
                  }} 
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
