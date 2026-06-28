import { NextRequest } from "next/server";
import { eventService } from "@/server/services/event.service";
import { guardAdmin, handle, jsonError } from "@/server/http";
import type { EventInput } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  return handle(() => eventService.list());
}

export async function POST(request: NextRequest) {
  const denied = await guardAdmin();
  if (denied) return denied;

  let body: EventInput;
  try {
    body = (await request.json()) as EventInput;
  } catch {
    return jsonError("Corpo da requisição inválido.");
  }

  if (!body?.band || !body?.genre || !body?.startsAt) {
    return jsonError("Banda, gênero e data/hora são obrigatórios.");
  }

  return handle(() => eventService.create(body), 201);
}
