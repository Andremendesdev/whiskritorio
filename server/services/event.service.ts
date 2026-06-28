import { prisma } from "@/lib/prisma";
import { fromDatetimeLocalValue } from "@/lib/datetime";
import { toEventDTO } from "@/server/mappers";
import type { Event, EventInput } from "@/types";

function parseStartsAt(value: string): Date {
  if (value.includes("T") && !value.endsWith("Z") && !value.includes("+")) {
    return new Date(fromDatetimeLocalValue(value));
  }
  return new Date(value);
}

function toEventData(input: EventInput) {
  return {
    band: input.band,
    genre: input.genre,
    description: input.description,
    imageUrl: input.imageUrl || null,
    startsAt: parseStartsAt(input.startsAt),
    ticketUrl: input.ticketUrl || null,
    active: input.active,
  };
}

export const eventService = {
  async list(): Promise<Event[]> {
    const rows = await prisma.event.findMany({
      orderBy: { startsAt: "asc" },
    });
    return rows.map(toEventDTO);
  },

  /** Shows ativos com data futura — vitrine pública. */
  async listUpcoming(): Promise<Event[]> {
    const rows = await prisma.event.findMany({
      where: {
        active: true,
        startsAt: { gte: new Date() },
      },
      orderBy: { startsAt: "asc" },
    });
    return rows.map(toEventDTO);
  },

  async getById(id: string): Promise<Event | null> {
    const row = await prisma.event.findUnique({ where: { id } });
    return row ? toEventDTO(row) : null;
  },

  async create(input: EventInput): Promise<Event> {
    const row = await prisma.event.create({
      data: toEventData(input),
    });
    return toEventDTO(row);
  },

  async update(id: string, input: EventInput): Promise<Event> {
    const row = await prisma.event.update({
      where: { id },
      data: toEventData(input),
    });
    return toEventDTO(row);
  },

  async remove(id: string): Promise<void> {
    await prisma.event.delete({ where: { id } });
  },
};
