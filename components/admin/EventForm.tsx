"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import { toDatetimeLocalValue } from "@/lib/datetime";
import type { Event, EventInput } from "@/types";

interface EventFormProps {
  editingEvent: Event | null;
  onSubmit: (event: EventInput) => void;
  onCancel: () => void;
}

type UploadedFile = {
  url?: string;
  ufsUrl?: string;
  serverData?: {
    imageUrl?: string;
  };
};

function getUploadedImageUrl(file?: UploadedFile) {
  return file?.serverData?.imageUrl ?? file?.ufsUrl ?? file?.url ?? "";
}

export function EventForm({ editingEvent, onSubmit, onCancel }: EventFormProps) {
  const [imageUrl, setImageUrl] = useState(editingEvent?.imageUrl ?? "");
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(editingEvent?.imageUrl ?? "");
    setUploadError(null);
  }, [editingEvent]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    onSubmit({
      band: String(form.get("band") ?? "").trim(),
      genre: String(form.get("genre") ?? "").trim(),
      description: String(form.get("description") ?? "").trim(),
      startsAt: String(form.get("startsAt") ?? ""),
      ticketUrl: String(form.get("ticketUrl") ?? "").trim(),
      imageUrl,
      active: form.get("active") === "on",
    });

    event.currentTarget.reset();
    setImageUrl("");
    setUploadError(null);
  }

  return (
    <form
      key={editingEvent?.id ?? "new-event"}
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/[0.035] p-5"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl uppercase text-white" style={{ fontFamily: "var(--font-bebas)" }}>
            {editingEvent ? "Editar show" : "Novo show"}
          </h2>
          <p className="text-sm text-zinc-500">Cadastre bandas e datas na agenda ao vivo.</p>
        </div>
        {editingEvent && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-zinc-400 hover:text-white"
          >
            Cancelar
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Banda</span>
          <input
            name="band"
            required
            defaultValue={editingEvent?.band}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-yellow-500/50"
            placeholder="Dead Signal"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Gênero</span>
          <input
            name="genre"
            required
            defaultValue={editingEvent?.genre}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-yellow-500/50"
            placeholder="Heavy Metal"
          />
        </label>

        <label className="space-y-2 sm:col-span-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
            Data e hora
          </span>
          <input
            name="startsAt"
            required
            type="datetime-local"
            defaultValue={editingEvent ? toDatetimeLocalValue(editingEvent.startsAt) : undefined}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-yellow-500/50"
          />
        </label>

        <label className="space-y-2 sm:col-span-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
            Link de ingressos
          </span>
          <input
            name="ticketUrl"
            type="url"
            defaultValue={editingEvent?.ticketUrl ?? ""}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-yellow-500/50"
            placeholder="https://..."
          />
        </label>

        <div className="space-y-2 sm:col-span-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Imagem</span>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
            <div className="relative mb-3 flex h-36 items-center justify-center overflow-hidden rounded-xl bg-zinc-950">
              {imageUrl ? (
                <>
                  <Image src={imageUrl} alt="Prévia do show" fill sizes="320px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute right-2 top-2 rounded-full border border-white/15 bg-black/70 p-2 text-white transition hover:bg-red-500/80"
                    aria-label="Remover imagem"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-center text-zinc-600">
                  <ImagePlus className="h-8 w-8" />
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">Sem imagem</span>
                </div>
              )}
            </div>

            <UploadButton
              endpoint="productImage"
              onClientUploadComplete={(files) => {
                const uploadedUrl = getUploadedImageUrl(files[0] as UploadedFile);
                if (uploadedUrl) {
                  setImageUrl(uploadedUrl);
                  setUploadError(null);
                }
              }}
              onUploadError={(error: Error) => {
                setUploadError(error.message || "Erro ao enviar imagem.");
              }}
              appearance={{
                container: "w-full",
                button:
                  "w-full rounded-xl bg-[var(--neon)] px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-black transition hover:scale-[1.01] ut-readying:bg-zinc-700 ut-uploading:bg-yellow-400",
                allowedContent: "mt-2 text-center text-[11px] text-zinc-600",
              }}
              content={{
                button: "Enviar imagem",
                allowedContent: "PNG, JPG ou WEBP até 4MB",
              }}
            />

            {uploadError && <p className="mt-2 text-xs text-red-300">{uploadError}</p>}
          </div>
        </div>

        <label className="space-y-2 sm:col-span-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Descrição</span>
          <textarea
            name="description"
            required
            defaultValue={editingEvent?.description}
            className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-yellow-500/50"
            placeholder="Descrição curta do show"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-3 text-sm text-zinc-400">
          <input
            name="active"
            type="checkbox"
            defaultChecked={editingEvent?.active ?? true}
            className="h-4 w-4 accent-yellow-500"
          />
          Show visível na home
        </label>

        <button
          type="submit"
          className="rounded-full bg-[var(--neon)] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-black transition hover:scale-[1.02]"
        >
          {editingEvent ? "Salvar alterações" : "Criar show"}
        </button>
      </div>
    </form>
  );
}
