const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with sample content...');

  await prisma.service.deleteMany();
  await prisma.galleryImage.deleteMany();

  await prisma.service.createMany({
    data: [
      {
        name: "Structural Steel Fabrication",
        slug: "structural-steel",
        description: "Heavy-duty steel beams, columns, and trusses engineered for large commercial buildings, industrial warehouses, and architectural marvels. Our state-of-the-art facility ensures precise cuts and welds that meet the highest industry safety standards.",
        thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        active: true,
        order: 1,
      },
      {
        name: "Custom Metal Machining",
        slug: "custom-machining",
        description: "Precision CNC machining for bespoke metal components. Tolerances down to the micron for aerospace, automotive, and industrial applications. Our advanced equipment can handle complex geometries and rare alloys.",
        thumbnail: "https://images.unsplash.com/photo-1565439390236-c4d3db2ad5bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        active: true,
        order: 2,
      },
      {
        name: "Industrial Welding",
        slug: "industrial-welding",
        description: "Certified MIG, TIG, and Arc welding services. We provide structural integrity that withstands the most extreme commercial environments. Our welders are heavily certified.",
        thumbnail: "https://images.unsplash.com/photo-1574681659220-4363f8e50b91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        active: true,
        order: 3,
      }
    ]
  });

  await prisma.galleryImage.createMany({
    data: [
      { url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80", alt: "Steel Beams Structure", type: "GALLERY", order: 1 },
      { url: "https://images.unsplash.com/photo-1504307651254-35680f356f27?auto=format&fit=crop&w=800&q=80", alt: "Industrial Welding", type: "GALLERY", order: 2 },
      { url: "https://images.unsplash.com/photo-1565439390236-c4d3db2ad5bf?auto=format&fit=crop&w=800&q=80", alt: "CNC Machining", type: "GALLERY", order: 3 },
      { url: "https://images.unsplash.com/photo-1574681659220-4363f8e50b91?auto=format&fit=crop&w=800&q=80", alt: "Pipeline Fabrication", type: "GALLERY", order: 4 },
      { url: "https://images.unsplash.com/photo-1533422902779-facfac30075f?auto=format&fit=crop&w=800&q=80", alt: "Factory Floor", type: "GALLERY", order: 5 },
      { url: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=800&q=80", alt: "Precision Tools", type: "GALLERY", order: 6 },
    ]
  });

  console.log('Successfully seeded database!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
