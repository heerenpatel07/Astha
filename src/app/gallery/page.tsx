import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  let images = await prisma.galleryImage.findMany({
    orderBy: { order: "asc" }
  });

  if (images.length === 0) {
    images = [
      { id: "1", url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80", alt: "Steel Beams Structure", type: "GALLERY", order: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: "2", url: "https://images.unsplash.com/photo-1504307651254-35680f356f27?auto=format&fit=crop&w=800&q=80", alt: "Industrial Welding", type: "GALLERY", order: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: "3", url: "https://images.unsplash.com/photo-1565439390236-c4d3db2ad5bf?auto=format&fit=crop&w=800&q=80", alt: "CNC Machining", type: "GALLERY", order: 3, createdAt: new Date(), updatedAt: new Date() },
      { id: "4", url: "https://images.unsplash.com/photo-1574681659220-4363f8e50b91?auto=format&fit=crop&w=800&q=80", alt: "Pipeline Fabrication", type: "GALLERY", order: 4, createdAt: new Date(), updatedAt: new Date() },
      { id: "5", url: "https://images.unsplash.com/photo-1533422902779-facfac30075f?auto=format&fit=crop&w=800&q=80", alt: "Factory Floor", type: "GALLERY", order: 5, createdAt: new Date(), updatedAt: new Date() },
      { id: "6", url: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=800&q=80", alt: "Precision Tools", type: "GALLERY", order: 6, createdAt: new Date(), updatedAt: new Date() },
    ];
  }

  return (
    <>
      <div className={styles.galleryHeader}>
        <div className="container">
          <h1 className={styles.title}>Project <span className="text-gradient">Gallery</span></h1>
        </div>
      </div>

      <section className="container">
        <div className={styles.grid}>
          {images.map((img) => (
            <div key={img.id} className={styles.imageCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt || "Gallery Image"} className={styles.image} />
              <div className={styles.overlay}>
                <h4>{img.alt}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
