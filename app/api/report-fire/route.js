import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { location, description, imageUrl } = body;

    // Here you would normally save to a database.
    // For now, we just mock a successful submission.
    console.log("New Fire Report Received:", { location, description, imageUrl });

    return NextResponse.json({
      success: true,
      message: "Fire report submitted successfully. Authorities have been alerted.",
      reportId: Math.random().toString(36).substring(7)
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Failed to submit report. Please try again." 
    }, { status: 500 });
  }
}
