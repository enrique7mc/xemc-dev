import { ImageResponse } from "next/og";

export const ogImageSize = {
  width: 1200,
  height: 630,
};

export const ogImageContentType = "image/png";

type OgImageInput = {
  section: string;
  title: string;
  description: string;
};

export function createOgImage({ section, title, description }: OgImageInput) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          color: "#f7f7f7",
          padding: "56px 64px",
          border: "1px solid #2a2a2a",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#b8b8b8",
          }}
        >
          <span style={{ fontWeight: 700, color: "#f7f7f7" }}>XEMC</span>
          <span>{section}</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: "980px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 74,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: -1.5,
            }}
          >
            {title}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 32,
              lineHeight: 1.3,
              color: "#d3d3d3",
            }}
          >
            {description}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            fontSize: 20,
            color: "#9a9a9a",
          }}
        >
          <span>Frontend engineering + interface design</span>
          <span>xemc.dev</span>
        </div>
      </div>
    ),
    ogImageSize,
  );
}
