import { NextRequest } from "next/server";
import { eventService } from "@/server/services/event.service";
import { guardAdmin, handle, jsonError } from "@/server/http";
import type { EventInput } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  return handle(async () => {
    const event = await eventService.getById(id);
    if (!event) throw new Error("Show não encontrado.");
    return event;
  });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const denied = await guardAdmin();
  if (denied) return denied;

  const { id } = await params;

  let body: EventInput;
  try {
    body = (await request.json()) as EventInput;
  } catch {
    return jsonError("Corpo da requisição inválido.");
  }

  if (!body?.band || !body?.genre || !body?.startsAt) {
    return jsonError("Banda, gênero e data/hora são obrigatórios.");
  }

  return handle(() => eventService.update(id, body));
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const denied = await guardAdmin();
  if (denied) return denied;

  const { id } = await params;
  return handle(async () => {
    await eventService.remove(id);
    return { ok: true };
  });
}
