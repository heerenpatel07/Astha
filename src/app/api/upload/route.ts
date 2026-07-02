import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Basic type validation (images only)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Uploaded file must be an image" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a safe unique filename to avoid overwrites
    const ext = path.extname(file.name) || ".png";
    const cleanBaseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueFilename = `${cleanBaseName}_${Date.now()}${ext}`;

    // Define static storage directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure path exists
    await mkdir(uploadDir, { recursive: true });

    // Write file to disk
    const filePath = path.join(uploadDir, uniqueFilename);
    await writeFile(filePath, buffer);

    // Return the relative browser URL
    const relativeUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({ 
      url: relativeUrl,
      success: true 
    });
  } catch (error) {
    console.error("Error in upload API:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
