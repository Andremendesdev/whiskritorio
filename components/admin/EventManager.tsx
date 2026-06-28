"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { EventTable } from "@/components/admin/EventTable";
import { ToastContainer, useToast } from "@/components/admin/AdminToast";
import { useEvents } from "@/hooks/useEvents";
import type { Event, EventInput } from "@/types";

export function EventManager() {
  const router = useRouter();
  const { events, loading, error, createEvent, updateEvent, removeEvent } = useEvents();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toasts, push, dismiss } = useToast();

  async function handleSubmit(input: EventInput) {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, input);
        setEditingEvent(null);
        router.refresh();
        push(`"${input.band}" atualizado com sucesso.`, "success");
      } else {
        await createEvent(input);
        router.refresh();
        push(`"${input.band}" adicionado à agenda.`, "success");
      }
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao salvar show.", "error");
    }
  }

  async function handleDelete(id: string) {
    const target = events.find((event) => event.id === id);
    if (!window.confirm(`Deletar "${target?.band ?? "show"}"?`)) return;
    try {
      await removeEvent(id);
      if (editingEvent?.id === id) setEditingEvent(null);
      router.refresh();
      push(`"${target?.band ?? "Show"}" removido.`, "info");
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao remover show.", "error");
    }
  }

  function handleEdit(event: Event) {
    setEditingEvent(event);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      <div className="space-y-6">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--neon)]">CRUD</p>
          <h1 className="mt-2 text-5xl uppercase text-white" style={{ fontFamily: "var(--font-bebas)" }}>
            Shows
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Gerencie a agenda de shows ao vivo na home.
          </p>
        </section>

        {error && (
          <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-1 xl:grid-cols-[minmax(340px,420px)_minmax(0,1fr)]">
          <div className="xl:sticky xl:top-24">
            <EventForm
              editingEvent={editingEvent}
              onSubmit={handleSubmit}
              onCancel={() => setEditingEvent(null)}
            />
          </div>

          <EventTable
            events={events}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
}
