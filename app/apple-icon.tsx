import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          borderRadius: 36,
          border: "4px solid #262626",
          position: "relative",
        }}
      >
        <svg
          viewBox="0 0 36 36"
          width="120"
          height="120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 18 7 L 9 27 L 13.5 27 L 18 16.5 L 22.5 27 L 27 27 Z"
            fill="#F5F5F5"
          />
          <path
            d="M 18 11.5 C 23.5 11.5 25.5 15 25.5 18.5 C 25.5 22 22 24 18 24"
            stroke="#E31B23"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="18" cy="18" r="2.2" fill="#E31B23" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
