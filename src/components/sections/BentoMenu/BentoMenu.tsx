import { getProducts } from "./bento.data";
import { BentoGrid } from "./BentoGrid";

export async function BentoMenu() {
  const products = await getProducts();

  return (
    <section
      id="menu"
      className="flex min-h-screen flex-col gap-10 bg-sand px-6 py-32 text-absolute md:px-16"
    >
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-4xl md:text-6xl">Menú</h2>
        <p className="font-serif-italic text-forest max-w-md text-lg italic">
          Café, pastelería, sándwiches y dulces de autor.
        </p>
      </div>
      <BentoGrid products={products} />
    </section>
  );
}
