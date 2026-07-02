import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./page.module.css";
import Image from "next/image";

// Force dynamic since it's a CMS, we want fresh data
export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  // Fetch active services from the database
  let services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" }
  });

  // Fallback data if database is empty so the user can see the UI
  if (services.length === 0) {
    services = [
      {
        id: "1",
        name: "Structural Steel Fabrication",
        slug: "structural-steel",
        description: "Heavy-duty steel beams, columns, and trusses engineered for large commercial buildings, industrial warehouses, and architectural marvels.",
        thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
        description: "Precision CNC machining for bespoke metal components. Tolerances down to the micron for aerospace, automotive, and industrial applications.",
        thumbnail: "https://images.unsplash.com/photo-1565439390236-c4d3db2ad5bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
        description: "Certified MIG, TIG, and Arc welding services. We provide structural integrity that withstands the most extreme commercial environments.",
        thumbnail: "https://images.unsplash.com/photo-1574681659220-4363f8e50b91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        active: true,
        order: 3,
        images: "[]",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
  }

  return (
    <>
      <div className={styles.servicesHeader}>
        <div className="container">
          <h1 className={styles.title}>Our <span className="text-gradient">Services</span></h1>
        </div>
      </div>

      <section className="container">
        <div className={styles.grid}>
          {services.map((service) => (
            <Link href={`/services/${service.slug}`} key={service.id} className={styles.card}>
              <div className={styles.thumbnailContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={service.thumbnail || "/uploads/Screenshot_2026_07_02_211258_1783007010969.png"} 
                  alt={service.name} 
                  className={styles.thumbnail}
                />
              </div>
              <div className={styles.content}>
                <h3 className={styles.serviceTitle}>{service.name}</h3>
                <p className={styles.serviceDesc}>{service.description.substring(0, 120)}...</p>
                <div className={styles.readMore}>
                  View Details <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
