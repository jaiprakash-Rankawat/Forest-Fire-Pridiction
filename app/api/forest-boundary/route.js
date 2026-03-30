import { NextResponse } from "next/server";
import { forestBoundary } from "@/app/data/kumbhalgarhData";

export async function GET() {
  return NextResponse.json(forestBoundary);
}
