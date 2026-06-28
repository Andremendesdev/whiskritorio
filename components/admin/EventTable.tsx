"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { Edit3, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { formatOrderDateTime } from "@/lib/datetime";
import type { Event } from "@/types";
import { EventTableSkeleton } from "@/components/admin/AdminSkeleton";

const PAGE_SIZE = 5;

interface EventTableProps {
  events: Event[];
  loading?: boolean;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

function EventThumb({ event }: { event: Event }) {
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
      {event.imageUrl ? (
        <Image src={event.imageUrl} alt={event.band} fill sizes="48px" className="object-cover" />
      ) : (
        <div className="h-full w-full bg-zinc-800" />
      )}
    </div>
  );
}

function EventActions({
  event,
  onEdit,
  onDelete,
}: {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex shrink-0 gap-2">
      <button
        type="button"
        onClick={() => onEdit(event)}
        className="rounded-xl border border-white/10 p-2 text-zinc-400 transition hover:border-yellow-500/40 hover:bg-yellow-500/5 hover:text-white"
        aria-label={`Editar ${event.band}`}
      >
        <Edit3 className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(event.id)}
        className="rounded-xl border border-white/10 p-2 text-zinc-400 transition hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-200"
        aria-label={`Deletar ${event.band}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function EventRowCard({
  event,
  onEdit,
  onDelete,
}: {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:bg-white/[0.02] lg:hidden">
      <div className="flex items-start gap-3">
        <EventThumb event={event} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-white">{event.band}</h3>
            {!event.active && (
              <span className="shrink-0 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Inativo
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-zinc-500">{event.genre}</p>
          <p className="mt-1 text-xs text-zinc-600">{formatOrderDateTime(event.startsAt)}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3 border-t border-white/10 pt-3">
        <EventActions event={event} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </article>
  );
}

function EventTableRow({
  event,
  onEdit,
  onDelete,
}: {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <article className="hidden grid-cols-[minmax(0,1.4fr)_0.7fr_1fr_auto] items-center gap-4 px-4 py-3 transition hover:bg-white/[0.02] lg:grid">
      <div className="flex min-w-0 items-center gap-3">
        <EventThumb event={event} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-white">{event.band}</h3>
            {!event.active && (
              <span className="shrink-0 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Inativo
              </span>
            )}
          </div>
          <p className="truncate text-xs text-zinc-500">{event.description}</p>
        </div>
      </div>

      <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-zinc-300">
        {event.genre}
      </span>

      <span className="text-xs text-zinc-400">{formatOrderDateTime(event.startsAt)}</span>

      <div className="flex justify-end">
        <EventActions event={event} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </article>
  );
}

export function EventTable({ events, loading, onEdit, onDelete }: EventTableProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
      setPage(1);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const filtered = useMemo(() => {
    return events.filter((event) => {
      if (!debouncedSearch) return true;
      return (
        event.band.toLowerCase().includes(debouncedSearch) ||
        event.genre.toLowerCase().includes(debouncedSearch) ||
        event.description.toLowerCase().includes(debouncedSearch)
      );
    });
  }, [events, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-zinc-500">
          {filtered.length} de {events.length} shows
        </p>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar show…"
            className="h-9 w-full rounded-xl border border-white/10 bg-black/30 pl-8 pr-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-yellow-500/40"
          />
        </div>
      </div>

      {loading ? (
        <EventTableSkeleton />
      ) : (
        <>
          <div className="space-y-3 lg:hidden">
            {paginated.map((event) => (
              <EventRowCard key={event.id} event={event} onEdit={onEdit} onDelete={onDelete} />
            ))}
            {paginated.length === 0 && (
              <p className="rounded-2xl border border-white/10 px-4 py-10 text-center text-sm text-zinc-500">
                Nenhum show encontrado.
              </p>
            )}
          </div>

          <div className="hidden overflow-x-auto rounded-2xl border border-white/10 lg:block">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-[minmax(0,1.4fr)_0.7fr_1fr_auto] gap-4 border-b border-white/10 bg-black/30 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                <span>Show</span>
                <span>Gênero</span>
                <span>Data</span>
                <span className="text-right">Ações</span>
              </div>

              <div className="divide-y divide-white/10">
                {paginated.map((event) => (
                  <EventTableRow
                    key={event.id}
                    event={event}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}

                {paginated.length === 0 && (
                  <p className="px-4 py-10 text-center text-sm text-zinc-500">
                    Nenhum show encontrado.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">
            Página {safePage} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex h-8 items-center gap-1 rounded-xl border border-white/10 px-3 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white disabled:opacity-30 lg:px-2"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="lg:hidden">Anterior</span>
            </button>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex h-8 items-center gap-1 rounded-xl border border-white/10 px-3 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white disabled:opacity-30 lg:px-2"
            >
              <span className="lg:hidden">Próximo</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
