import { NextResponse } from "next/server";
import { db } from "../../../db";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const groupId = Number((await params).id); const body = await request.json(); const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!Number.isInteger(groupId) || groupId <= 0 || !name) return NextResponse.json({ error: "Enter a valid member name and group." }, { status: 400 });
  if (!(await db.group.findUnique({ where: { id: groupId } }))) return NextResponse.json({ error: "Group not found." }, { status: 404 });
  try { return NextResponse.json(await db.member.create({ data: { groupId, name } }), { status: 201 }); }
  catch { return NextResponse.json({ error: "That member is already in this group." }, { status: 409 }); }
}
