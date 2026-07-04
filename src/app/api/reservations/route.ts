import { NextResponse } from "next/server";
import { reservationSchema } from "@/components/sections/ContactoReservas/reservation.schema";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  timestamps.push(now);
  hits.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "validation" },
      { status: 400 },
    );
  }

  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation" },
      { status: 400 },
    );
  }

  const { fullName, email, phone, partySize, reservationDate, reservationTime, message } =
    parsed.data;

  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("reservations").insert({
      full_name: fullName,
      email,
      phone: phone || null,
      party_size: partySize,
      reservation_date: reservationDate,
      reservation_time: reservationTime,
      message: message || null,
    });

    if (error) {
      console.error("[reservations] insert failed:", error.message);
      return NextResponse.json(
        { ok: false, error: "server_error" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[reservations] unexpected error:", err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 },
    );
  }
}
