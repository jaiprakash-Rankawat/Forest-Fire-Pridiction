import { NextResponse } from "next/server";
import { riskZones } from "@/app/data/kumbhalgarhData";

export async function GET() {
  return NextResponse.json(riskZones);
}
