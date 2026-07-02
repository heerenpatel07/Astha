import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  let images = await prisma.galleryImage.findMany({
    orderBy: { order: "asc" }
  });

  if (images.length === 0) {
    images = [
      { id: "1", url: "/uploads/Screenshot_2026_07_02_211258_1783007010969.png", alt: "Steel Beams Structure", type: "GALLERY", order: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: "2", url: "/uploads/Screenshot_2026_07_02_211258_1783007010969.png", alt: "Industrial Welding", type: "GALLERY", order: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: "3", url: "/uploads/Screenshot_2026_07_02_211258_1783007010969.png", alt: "CNC Machining", type: "GALLERY", order: 3, createdAt: new Date(), updatedAt: new Date() },
      { id: "4", url: "/uploads/Screenshot_2026_07_02_211258_1783007010969.png", alt: "Pipeline Fabrication", type: "GALLERY", order: 4, createdAt: new Date(), updatedAt: new Date() },
      { id: "5", url: "/uploads/Screenshot_2026_07_02_211258_1783007010969.png", alt: "Factory Floor", type: "GALLERY", order: 5, createdAt: new Date(), updatedAt: new Date() },
      { id: "6", url: "/uploads/Screenshot_2026_07_02_211258_1783007010969.png", alt: "Precision Tools", type: "GALLERY", order: 6, createdAt: new Date(), updatedAt: new Date() },
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
