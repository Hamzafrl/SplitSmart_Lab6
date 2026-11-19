import { NextResponse } from "next/server";
import { db } from "../db";
export async function GET() { return NextResponse.json(await db.group.findMany({ include: { members: true }, orderBy: { createdAt: "asc" } })); }
export async function POST(request: Request) {
  const body = await request.json(); const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return NextResponse.json({ error: "Enter a group name." }, { status: 400 });
  return NextResponse.json(await db.group.create({ data: { name } }), { status: 201 });
}
