import { ImageResponse } from "next/og";
export const alt = "PT Rekasaya Digital International — Software Engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", padding: 80, background: "#09090b", color: "white" }}>
    <div style={{ color: "#f87171", fontSize: 30 }}>SOFTWARE ENGINEERING</div>
    <div style={{ fontSize: 68, marginTop: 30 }}>PT Rekasaya Digital International</div>
  </div>, size);
}
