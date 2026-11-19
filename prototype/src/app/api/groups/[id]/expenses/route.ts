import { NextResponse } from "next/server";
import { db } from "../../../db";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const groupId = Number((await params).id);
  if (!Number.isInteger(groupId) || groupId <= 0) return NextResponse.json({ error: "Invalid group." }, { status: 400 });
  return NextResponse.json(await db.expense.findMany({ where: { groupId }, include: { payer: true, shares: { include: { member: true } } }, orderBy: { createdAt: "desc" } }));
}
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const groupId = Number((await params).id); const body = await request.json();
  const description = typeof body.description === "string" ? body.description.trim() : ""; const raw = String(body.amount ?? "");
  const amount = Number(raw); const payerId = Number(body.payerId); const participants: unknown = body.participantIds;
  if (!Number.isInteger(groupId) || groupId <= 0) return NextResponse.json({ error: "Invalid group." }, { status: 400 });
  if (!description) return NextResponse.json({ error: "Enter an expense description." }, { status: 400 });
  if (!Number.isFinite(amount) || amount <= 0 || !/^\d+(\.\d{1,2})?$/.test(raw)) return NextResponse.json({ error: "Amount must be greater than zero with at most two decimal places." }, { status: 400 });
  const amountCents = Math.round(amount * 100);
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) return NextResponse.json({ error: "Enter a valid expense amount." }, { status: 400 });
  if (!Array.isArray(participants) || participants.length === 0 || participants.some(v => !Number.isInteger(v) || v <= 0) || new Set(participants).size !== participants.length || !Number.isInteger(payerId) || payerId <= 0) return NextResponse.json({ error: "Choose a payer and at least one valid participant." }, { status: 400 });
  const ids = [...participants as number[], payerId]; const members = await db.member.findMany({ where: { groupId, id: { in: ids } } });
  if (members.length !== new Set(ids).size) return NextResponse.json({ error: "Payer and participants must belong to this group." }, { status: 400 });
  const base = Math.floor(amountCents / participants.length); const remainder = amountCents % participants.length;
  const shares = (participants as number[]).map((memberId, index) => ({ memberId, amountCents: base + (index < remainder ? 1 : 0) }));
  return NextResponse.json(await db.expense.create({ data: { groupId, description, amountCents, payerId, shares: { create: shares } }, include: { payer: true, shares: { include: { member: true } } } }), { status: 201 });
}
