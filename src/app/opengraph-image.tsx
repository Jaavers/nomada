import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "#0D0D0D",
        }}
      >
        <div style={{ color: "#C4A482", fontSize: 28, fontStyle: "italic" }}>
          Procesos lentos, tecnología fluida.
        </div>
        <div
          style={{
            color: "#F5F2EB",
            fontSize: 140,
            fontWeight: 700,
            letterSpacing: "-4px",
            marginTop: 20,
          }}
        >
          NÓMADA
        </div>
        <div style={{ color: "#C4A482", fontSize: 28, marginTop: 10 }}>
          Café de Origen — Valdivia, sur de Chile.
        </div>
      </div>
    ),
    { ...size },
  );
}
