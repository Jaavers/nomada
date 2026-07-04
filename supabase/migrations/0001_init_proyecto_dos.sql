-- NÓMADA · Café de Origen — schema aislado dentro del proyecto Supabase
-- compartido ("autowsp"). No toca ninguna tabla de public (otra app).

CREATE SCHEMA IF NOT EXISTS proyecto_dos;

CREATE TABLE proyecto_dos.reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (phone is null or char_length(phone) <= 40),
  party_size smallint not null check (party_size > 0 and party_size <= 20),
  reservation_date date not null check (reservation_date >= current_date),
  reservation_time time not null,
  message text check (message is null or char_length(message) <= 500),
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  source text not null default 'web'
);

ALTER TABLE proyecto_dos.reservations ENABLE ROW LEVEL SECURITY;

-- Deny-by-default: no SELECT/UPDATE/DELETE policy exists for anon/authenticated,
-- so submitted reservations are never readable by public clients.
CREATE POLICY "anon can insert reservations"
  ON proyecto_dos.reservations
  FOR INSERT
  TO anon
  WITH CHECK (
    char_length(full_name) between 2 and 120
    and party_size > 0 and party_size <= 20
    and reservation_date >= current_date
  );

CREATE TABLE proyecto_dos.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  category text not null check (category in ('cafe','pasteleria','sandwich','dulce')),
  name text not null,
  origin text,
  detail text,
  notes text,
  price numeric(10,2) not null check (price >= 0),
  display_order smallint not null default 0,
  is_available boolean not null default true
);

ALTER TABLE proyecto_dos.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read available products"
  ON proyecto_dos.products
  FOR SELECT
  TO anon
  USING (is_available = true);

-- Seed: catálogo real entregado por el cliente (20 productos, 4 categorías).
INSERT INTO proyecto_dos.products (category, name, origin, detail, notes, price, display_order) VALUES
('cafe', 'V60 Geisha de Panamá', 'Finca Jaramillo (1,950m).', NULL, 'Jazmín, bergamota, té negro y una acidez cítrica brillante de alta claridad.', 24.00, 1),
('cafe', 'Flat White Doble Ristretto', 'Casa Blend (Etiopía + Brasil).', NULL, 'Extracción corta balanceada con leche emulsionada fina a 65°C y notas dulces de cacao.', 14.50, 2),
('cafe', 'Nitro Cold Brew Infusionado', 'Etiopía Sidamo.', NULL, 'Extracción en frío por 18 horas, infundido con nitrógeno para una textura cremosa tipo Guinness.', 16.00, 3),
('cafe', 'Espresso Macchiato Cortado', 'Colombia Bourbon Rosado.', NULL, 'Una carga densa de espresso con una sutil corona de microespuma aterciopelada.', 12.00, 4),
('cafe', 'Chemex Cold Drip Especial', 'Kenia AA.', NULL, 'Filtrado lento en hielo que resalta notas intensas a frutos rojos y cuerpo ligero y limpio.', 19.50, 5),

('pasteleria', 'Torta Nómada de Autor', NULL, 'Bizcocho húmedo de pistacho, mousse concentrado de chocolate amargo al 72% y cardamomo.', NULL, 19.00, 1),
('pasteleria', 'Cheesecake de Frutos del Ranco', NULL, 'Crema densa horneada al estilo Nueva York con salsa artesanal de berries silvestres locales.', NULL, 12.50, 2),
('pasteleria', 'Tartaleta de Higos y Frangipane', NULL, 'Base de masa quebrada, crema de almendras horneada y cobertura de higos frescos macerados.', NULL, 15.00, 3),
('pasteleria', 'Éclair de Caramelo Salado', NULL, 'Masa choux crujiente rellena de crema pastelera de vainilla y glaseado de toffee con sal de Cahuil.', NULL, 11.50, 4),
('pasteleria', 'Ópera de Café de Especialidad', NULL, 'Capas finas de bizcocho joconde embebido en espresso de la casa, ganache de chocolate y crema de mantequilla de café.', NULL, 17.00, 5),

('sandwich', 'Ciabatta Rústico Serrano', NULL, 'Jamón serrano reserva, rúcula hidropónica, queso brie fundido y pesto de la casa en pan de masa madre.', NULL, 15.50, 1),
('sandwich', 'Toast de Palta & Huevo Pochado', NULL, 'Base crujiente de hogaza integral con palta asada, huevo de campo pochado y sésamo negro orgánico.', NULL, 13.00, 2),
('sandwich', 'Sándwich Brioche de Salmón Ahumado', NULL, 'Salmón ahumado del sur, crema de eneldo, alcaparras y pepinillos agridulces en pan brioche artesanal.', NULL, 18.50, 3),
('sandwich', 'Focaccia Vegana de Estación', NULL, 'Focaccia de romero con pimentones asados, berenjenas confitadas, hummus de garbanzo y reducción de balsámico.', NULL, 14.00, 4),
('sandwich', 'Pastrami & Provolone Hot Press', NULL, 'Láminas finas de pastrami artesanal, queso provolone ahumado, mostaza antigua y chucrut en pan de centeno.', NULL, 16.50, 5),

('dulce', 'Croissant de Almendras Laminadas', NULL, 'Capas crujientes horneadas con mantequilla de Normandía, relleno de praliné artesanal y almendras tostadas.', NULL, 11.00, 1),
('dulce', 'Macarons de Lavanda y Miel', NULL, 'Caja de tres unidades de alta repostería francesa contemporánea infusionada con flores orgánicas.', NULL, 9.50, 2),
('dulce', 'Cinnamon Roll de Masa Madre', NULL, 'Rollo especiado con canela de Ceylán, glaseado denso de queso crema y un toque de vainilla natural.', NULL, 10.00, 3),
('dulce', 'Financier de Avellanas del Sur', NULL, 'Bizcocho francés húmedo a base de mantequilla avellanada (noisette) y harina de avellanas nativas.', NULL, 8.00, 4),
('dulce', 'Tinto de Chocolate y Sal de Mar', NULL, 'Trufas de ganache de chocolate negro amargo enrolladas en cacao en polvo con cristales de sal.', NULL, 12.00, 5);
