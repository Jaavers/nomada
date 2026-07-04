"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap/gsapConfig";
import { useSound } from "@/hooks/useSound";
import { Magnetic } from "@/components/ui/Magnetic";
import { reservationSchema } from "./reservation.schema";

type Status = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "border-absolute/20 focus:border-forest w-full rounded-xl border bg-white/60 px-4 py-3 text-sm outline-none transition-colors";

const labelClasses =
  "text-absolute/60 text-xs tracking-widest uppercase";

export function ReservationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const { play } = useSound();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      partySize: String(formData.get("partySize") ?? ""),
      reservationDate: String(formData.get("reservationDate") ?? ""),
      reservationTime: String(formData.get("reservationTime") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const parsed = reservationSchema.safeParse(payload);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      play("cta");
      formRef.current?.reset();
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { opacity: 0.4 },
          { opacity: 1, duration: 0.6, ease: "power2.out" },
        );
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border-forest/30 bg-forest/5 flex flex-col gap-2 rounded-2xl border p-8">
        <p className="font-display text-2xl text-forest">Reserva enviada</p>
        <p className="text-absolute/70 text-sm">
          Te confirmaremos por correo a la brevedad.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex max-w-xl flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="fullName" className={labelClasses}>
            Nombre completo
          </label>
          <input id="fullName" name="fullName" required className={inputClasses} />
          {fieldErrors.fullName && (
            <span className="text-xs text-red-700">{fieldErrors.fullName}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className={labelClasses}>
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClasses}
          />
          {fieldErrors.email && (
            <span className="text-xs text-red-700">{fieldErrors.email}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className={labelClasses}>
            Teléfono (opcional)
          </label>
          <input id="phone" name="phone" className={inputClasses} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="partySize" className={labelClasses}>
            Personas
          </label>
          <input
            id="partySize"
            name="partySize"
            type="number"
            min={1}
            max={20}
            required
            className={inputClasses}
          />
          {fieldErrors.partySize && (
            <span className="text-xs text-red-700">{fieldErrors.partySize}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="reservationTime" className={labelClasses}>
            Hora
          </label>
          <input
            id="reservationTime"
            name="reservationTime"
            type="time"
            required
            className={inputClasses}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="reservationDate" className={labelClasses}>
          Fecha
        </label>
        <input
          id="reservationDate"
          name="reservationDate"
          type="date"
          required
          className={inputClasses}
        />
        {fieldErrors.reservationDate && (
          <span className="text-xs text-red-700">
            {fieldErrors.reservationDate}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className={labelClasses}>
          Mensaje (opcional)
        </label>
        <textarea id="message" name="message" rows={3} className={inputClasses} />
      </div>

      <Magnetic>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-forest text-sand rounded-full px-6 py-3 text-sm tracking-widest uppercase transition-opacity disabled:opacity-60"
        >
          {status === "submitting" ? "Enviando…" : "Reservar mesa"}
        </button>
      </Magnetic>

      {status === "error" && Object.keys(fieldErrors).length === 0 && (
        <p className="text-sm text-red-700">
          No pudimos procesar tu reserva. Inténtalo nuevamente.
        </p>
      )}
    </form>
  );
}
