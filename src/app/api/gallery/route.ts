import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const image = await prisma.galleryImage.create({
      data: {
        url: body.url,
        alt: body.alt,
        type: body.type || 'GALLERY',
        order: body.order ? parseInt(body.order) : 0,
      }
    });
    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
