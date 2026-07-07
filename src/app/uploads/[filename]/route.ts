import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Use persistent directory if configured, otherwise fallback to public/uploads
    const uploadsDir = process.env.PERSISTENT_DIR 
      ? path.join(process.env.PERSISTENT_DIR, "uploads")
      : path.join(process.cwd(), "public", "uploads");
      
    const filePath = path.join(uploadsDir, filename);
    
    if (!existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }
    
    const fileBuffer = await readFile(filePath);
    const ext = path.extname(filename).toLowerCase();
    
    let contentType = "image/png";
    if (ext === ".jpg" || ext === ".jpeg") {
      contentType = "image/jpeg";
    } else if (ext === ".gif") {
      contentType = "image/gif";
    } else if (ext === ".webp") {
      contentType = "image/webp";
    } else if (ext === ".svg") {
      contentType = "image/svg+xml";
    }
    
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch (error) {
    console.error("Error serving uploaded file:", error);
    return new NextResponse("Error reading file", { status: 500 });
  }
}
