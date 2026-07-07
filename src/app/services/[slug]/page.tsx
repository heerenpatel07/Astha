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

  const whatsappSetting = await prisma.siteSetting.findUnique({
    where: { key: "social_whatsapp" }
  });
  const phoneSetting = await prisma.siteSetting.findUnique({
    where: { key: "phone" }
  });

  let whatsappBaseUrl = "https://wa.me/917600969878";
  if (whatsappSetting?.value) {
    const value = whatsappSetting.value.trim();
    if (value.startsWith("http")) {
      whatsappBaseUrl = value;
    } else {
      const cleaned = value.replace(/[^0-9]/g, "");
      whatsappBaseUrl = `https://wa.me/${cleaned}`;
    }
  } else if (phoneSetting?.value) {
    const cleaned = phoneSetting.value.replace(/[^0-9]/g, "");
    whatsappBaseUrl = `https://wa.me/${cleaned}`;
  }

  const whatsappMessage = encodeURIComponent(`Hello, I would like to inquire about your "${service.name}" service.`);
  const whatsappLink = `${whatsappBaseUrl}${whatsappBaseUrl.includes("?") ? "&" : "?"}text=${whatsappMessage}`;

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
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary">
                Request this Service
              </Link>
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  backgroundColor: '#25D366',
                  color: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'var(--transition)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = '#128C7E';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = '#25D366';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.005 5.291 5.3 0 11.794 0c3.148.001 6.107 1.227 8.331 3.453c2.224 2.225 3.45 5.186 3.45 8.339c-.006 6.505-5.301 11.797-11.795 11.797c-2.001-.001-3.97-.509-5.719-1.479L0 24zm6.59-4.846c1.6.95 3.472 1.453 5.385 1.456c5.4 0 9.794-4.394 9.8-9.798c0-2.617-1.02-5.078-2.871-6.93C17.062 2.03 14.6 1.01 12 1.01C6.59 1.01 2.2 5.405 2.197 10.81c0 1.96.512 3.878 1.483 5.584l-.97 3.547l3.634-.953zM16.9 14.16c-.274-.137-1.62-.8-1.87-.89c-.253-.09-.438-.137-.622.137c-.184.274-.712.89-.873 1.072c-.16.183-.32.206-.595.068c-.274-.137-1.157-.426-2.203-1.36c-.814-.726-1.364-1.623-1.524-1.897c-.16-.274-.017-.422.12-.558c.123-.122.274-.32.411-.48c.137-.16.183-.274.274-.457c.09-.183.046-.343-.023-.48c-.068-.137-.622-1.5-.853-2.057c-.225-.54-.45-.467-.622-.475c-.16-.008-.344-.01-.527-.01c-.184 0-.482.07-.735.343c-.253.274-.964.943-.964 2.3c0 1.357.988 2.668 1.125 2.85c.137.183 1.944 2.969 4.71 4.16c.658.283 1.173.453 1.573.58c.66.21 1.26.18 1.737.11.532-.08 1.62-.663 1.85-1.272c.23-.609.23-1.13.16-1.218c-.07-.088-.253-.137-.528-.274z"/>
                </svg>
                Inquire on WhatsApp
              </a>
            </div>
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
