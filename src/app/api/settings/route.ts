import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get all settings as a key-value object
export async function GET() {
  try {
    const settingsList = await prisma.siteSetting.findMany();
    const settings: Record<string, string> = {};
    settingsList.forEach(item => {
      settings[item.key] = item.value;
    });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// Upsert multiple settings
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Prepare upsert operations for each key-value pair
    const operations = Object.entries(body).map(([key, value]) => 
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    // Execute all operations in a transaction
    await prisma.$transaction(operations);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
