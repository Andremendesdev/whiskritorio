"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiGet, apiSend } from "@/lib/api";
import type { Event, EventInput } from "@/types";

type EventsListener = (source: string) => void;

const eventListeners = new Set<EventsListener>();

function notifyEventsChanged(source: string) {
  eventListeners.forEach((listener) => listener(source));
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sourceRef = useRef(`events-${Math.random().toString(36).slice(2)}`);
  const requestRef = useRef(0);

  const refresh = useCallback(async (options?: { silent?: boolean }) => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    if (!options?.silent) setLoading(true);
    setError(null);
    try {
      const freshEvents = await apiGet<Event[]>("/api/events");
      if (requestRef.current === requestId) {
        setEvents(freshEvents);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar shows.");
    } finally {
      if (requestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    function onEventsChanged(source: string) {
      if (source === sourceRef.current) return;
      void refresh({ silent: true });
    }

    eventListeners.add(onEventsChanged);
    return () => {
      eventListeners.delete(onEventsChanged);
    };
  }, [refresh]);

  const createEvent = useCallback(async (input: EventInput) => {
    const created = await apiSend<Event>("/api/events", "POST", input);
    await refresh({ silent: true });
    notifyEventsChanged(sourceRef.current);
    return created;
  }, [refresh]);

  const updateEvent = useCallback(async (id: string, input: EventInput) => {
    const updated = await apiSend<Event>(`/api/events/${id}`, "PUT", input);
    await refresh({ silent: true });
    notifyEventsChanged(sourceRef.current);
    return updated;
  }, [refresh]);

  const removeEvent = useCallback(async (id: string) => {
    await apiSend(`/api/events/${id}`, "DELETE");
    await refresh({ silent: true });
    notifyEventsChanged(sourceRef.current);
  }, [refresh]);

  return { events, loading, error, refresh, createEvent, updateEvent, removeEvent };
}
