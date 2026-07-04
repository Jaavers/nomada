import { ReservationForm } from "./ReservationForm";

export function ContactoReservas() {
  return (
    <section
      id="contacto"
      className="flex min-h-[80vh] flex-col justify-center gap-8 bg-sand px-6 py-32 text-absolute md:px-16"
    >
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-4xl md:text-6xl">
          Ubicación &amp; Reservas
        </h2>
        <p className="font-serif-italic text-forest max-w-md text-lg italic">
          Valdivia, sur de Chile. Reserva tu mesa.
        </p>
      </div>
      <ReservationForm />
    </section>
  );
}
