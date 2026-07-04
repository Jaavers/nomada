const MANIFESTO_TEXT =
  "NÓMADA nace en el sur, donde el tiempo se detiene para perfeccionar el tostado. Somos un santuario para el grano de origen único y los métodos de extracción de alta precisión. Al fusionar la pureza de los procesos lentos y artesanales con interfaces fluidas, transformamos el acto cotidiano de beber café en un ritual consciente de diseño, simetría y sabor.";

export function Manifiesto() {
  return (
    <section
      id="manifiesto"
      className="bg-nomada-dark flex min-h-[80vh] items-center px-6 py-32 md:px-16"
    >
      <p className="font-serif-italic relative z-10 max-w-3xl text-2xl leading-relaxed text-sand italic md:text-4xl">
        {MANIFESTO_TEXT}
      </p>
    </section>
  );
}
