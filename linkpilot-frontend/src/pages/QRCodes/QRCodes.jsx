import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { QrCode, Download, Loader2, Link2 } from "lucide-react";
import { getMyUrls, getQRCode } from "../../api/url.api.js";
import Button from "../../components/common/Button/Button.jsx";
import Input from "../../components/common/Input/Input.jsx";
import Loader from "../../components/common/Loader/Loader.jsx";

const DESIGN_PRESETS = [
  { id: "square", label: "Classic Square", class: "rounded-md" },
  { id: "dots", label: "Rounded Dots", class: "rounded-full" },
  { id: "radial", label: "Radial Gradient", class: "rounded-lg" },
];

export default function QRCodes() {
  const [selectedUrlId, setSelectedUrlId] = useState("");
  const [qrName, setQrName] = useState("");
  const [fgColor, setFgColor] = useState("#111111");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [design, setDesign] = useState("square");
  const [format, setFormat] = useState("PNG");
  const [qrBase64, setQrBase64] = useState("");
  const [canvasError, setCanvasError] = useState("");
  
  const canvasRef = useRef(null);

  // Fetch all user URLs
  const { data: urlsData, isLoading: urlsLoading } = useQuery({
    queryKey: ["my-urls", "for-qr"],
    queryFn: () => getMyUrls({ page: 1, limit: 100, sortBy: "createdAt", order: "desc" }),
  });

  const urls = urlsData?.data || [];
  const activeUrl = urls.find((u) => u.id === selectedUrlId) || urls[0];

  // Fetch QR Code base64 from backend when active link changes
  useEffect(() => {
    if (activeUrl) {
      setSelectedUrlId(activeUrl.id);
      setQrName(activeUrl.shortCode ? `QR Code - /${activeUrl.shortCode}` : "");

      const fetchQR = async () => {
        try {
          const res = await getQRCode(activeUrl.id);
          if (res.data?.qrCode) {
            setQrBase64(res.data.qrCode);
          }
        } catch (err) {
          console.error("Failed to load QR code:", err);
          setCanvasError("Could not retrieve QR code template.");
        }
      };

      fetchQR();
    }
  }, [activeUrl]);

  // Draw customized QR code on canvas whenever inputs change
  useEffect(() => {
    if (!qrBase64) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = qrBase64;

    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, 300, 300);
      
      // Draw standard QR Code
      ctx.drawImage(img, 0, 0, 300, 300);

      // Read pixel data to replace colors
      try {
        const imgData = ctx.getImageData(0, 0, 300, 300);
        const data = imgData.data;

        // Convert hex values to RGB
        const hexToRgb = (hex) => {
          const bigint = parseInt(hex.replace("#", ""), 16);
          return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
          };
        };

        const fg = hexToRgb(fgColor);
        const bg = hexToRgb(bgColor);

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Check if pixel is dark (part of QR modules) or light (background)
          const isDark = r < 120 && g < 120 && b < 120;

          if (isDark) {
            data[i] = fg.r;
            data[i + 1] = fg.g;
            data[i + 2] = fg.b;
          } else {
            data[i] = bg.r;
            data[i + 1] = bg.g;
            data[i + 2] = bg.b;
          }
        }

        ctx.putImageData(imgData, 0, 0);

        // Add Center Logo Overlay (Paper Plane SVG)
        const logoSize = 56;
        const logoX = (300 - logoSize) / 2;
        const logoY = (300 - logoSize) / 2;

        // Draw a clean background badge for the logo in the center
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        // Rounded square center container
        ctx.roundRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8, 12);
        ctx.fill();

        // Load and draw the brand logo mark
        const logoImg = new Image();
        logoImg.src = "/logo/linkpilot-mark.svg";
        logoImg.onload = () => {
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
        };
      } catch (err) {
        console.error("Canvas draw error:", err);
      }
    };
  }, [qrBase64, fgColor, bgColor, design]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const shortCode = activeUrl?.shortCode || "link";
    const filename = `linkpilot-qr-${shortCode}`;

    if (format === "PNG") {
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } else {
      // SVG format: wrap PNG in an SVG container
      const pngData = canvas.toDataURL("image/png");
      const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <image href="${pngData}" x="0" y="0" width="300" height="300" />
</svg>
      `.trim();
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.download = `${filename}.svg`;
      link.href = url;
      link.click();
      
      URL.revokeObjectURL(url);
    }
  };

  if (urlsLoading) {
    return (
      <div className="grid h-64 place-items-center">
        <Loader size={28} />
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="grid h-64 place-items-center rounded-2xl border border-dashed border-line text-center">
        <div className="space-y-3">
          <QrCode className="mx-auto h-8 w-8 text-slate" />
          <h3 className="font-display text-sm font-semibold text-ink">No short URLs found</h3>
          <p className="text-xs text-slate">Create a shortened link first to generate custom QR codes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-display max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">QR Codes</h1>
        <p className="text-sm text-slate mt-0.5">Generate, customize, and download QR codes for your links.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {/* Left Form Panel */}
        <div className="md:col-span-3 rounded-2xl border border-line bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-ink border-b border-line pb-3">Create QR Code</h2>

          {/* Link Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate">Destination URL</label>
            <select
              value={selectedUrlId}
              onChange={(e) => setSelectedUrlId(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              {urls.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.originalUrl.substring(0, 50)}... (/{u.shortCode})
                </option>
              ))}
            </select>
          </div>

          {/* QR Code Name */}
          <Input
            label="QR Code Name (Optional)"
            placeholder="Product Launch QR"
            value={qrName}
            onChange={(e) => setQrName(e.target.value)}
          />

          {/* Design Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate block">Design Pattern</label>
            <div className="grid grid-cols-3 gap-2">
              {DESIGN_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setDesign(preset.id)}
                  className={`border py-2.5 text-xs font-semibold px-2 transition ${
                    design === preset.id
                      ? "border-accent bg-accent-50 text-accent"
                      : "border-line text-slate hover:bg-mist"
                  } ${preset.class}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate">Foreground Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-8 w-8 rounded border border-line cursor-pointer"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-full rounded-lg border border-line px-2 py-1.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-8 w-8 rounded border border-line cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full rounded-lg border border-line px-2 py-1.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
            </div>
          </div>

          <Button onClick={handleDownload} className="w-full py-2.5 flex items-center justify-center gap-2 mt-4">
            <Download size={16} /> Download QR Code
          </Button>
        </div>

        {/* Right Preview Panel */}
        <div className="md:col-span-2 flex flex-col items-center justify-center rounded-2xl border border-line bg-paper p-6 shadow-sm gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:16px_16px]" />
          
          <div className="z-10 bg-white p-5 rounded-2xl shadow-md border border-line flex items-center justify-center relative">
            {!qrBase64 ? (
              <div className="flex flex-col items-center gap-2 w-[240px] h-[240px] justify-center">
                <Loader2 className="animate-spin text-accent" size={24} />
                <span className="text-xs text-slate">Loading template...</span>
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                width={300}
                height={300}
                className="w-[240px] h-[240px] block"
              />
            )}
            {canvasError && <p className="text-red-500 text-xs mt-2">{canvasError}</p>}
          </div>

          {/* Format selector */}
          <div className="z-10 flex gap-2 rounded-full border border-line bg-white p-1">
            {["PNG", "SVG"].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`rounded-full px-5 py-1.5 text-xs font-bold transition-all ${
                  format === fmt
                    ? "bg-ink text-white shadow-sm"
                    : "text-slate hover:text-ink"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
