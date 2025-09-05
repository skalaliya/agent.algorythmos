import { ImageResponse } from "next/og";
import { TEMPLATES } from "@/data/templates";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG({ params }: { params: { slug: string } }) {
  const t = TEMPLATES.find(x => x.slug === params.slug);
  const title = t?.title ?? "Algorythmos Template";
  const subtitle = t?.subtitle ?? "Automate your workflows with AI";
  
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B0B12 0%, #3715E0 100%)",
          color: "white",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "12px",
              background: "linear-gradient(90deg, #6D00FF 0%, #7658E7 50%, #3715E0 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "20px",
            }}
          >
            <span style={{ fontSize: "24px", fontWeight: "bold" }}>A</span>
          </div>
          <span style={{ fontSize: "32px", fontWeight: "600" }}>algorythmos.app</span>
        </div>
        
        <div
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "20px",
            maxWidth: "1000px",
            lineHeight: "1.1",
          }}
        >
          {title}
        </div>
        
        <div
          style={{
            fontSize: "32px",
            textAlign: "center",
            opacity: 0.8,
            maxWidth: "900px",
            lineHeight: "1.3",
          }}
        >
          {subtitle}
        </div>
        
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            fontSize: "24px",
            opacity: 0.6,
          }}
        >
          Template
        </div>
      </div>
    ),
    { ...size }
  );
}
