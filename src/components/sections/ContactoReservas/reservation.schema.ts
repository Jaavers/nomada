import { z } from "zod";

export const reservationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  partySize: z.coerce.number().int().min(1).max(20),
  reservationDate: z.string().refine((val) => {
    const date = new Date(`${val}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !Number.isNaN(date.getTime()) && date >= today;
  }, "La fecha debe ser hoy o en el futuro."),
  reservationTime: z.string().regex(/^\d{2}:\d{2}$/),
  message: z.string().trim().max(500).optional().or(z.literal("")),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
