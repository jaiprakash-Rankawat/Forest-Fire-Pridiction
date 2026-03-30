import { NextResponse } from "next/server";
import { lastFires } from "@/app/data/kumbhalgarhData";

export async function GET() {
  return NextResponse.json(lastFires);
}
