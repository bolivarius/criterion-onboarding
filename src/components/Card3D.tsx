"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useRef,
  useMemo,
  useEffect,
  useState,
  Suspense,
} from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════
 *  Types
 * ═══════════════════════════════════════════ */
export interface CardSkin {
  id: string;
  label: string;
  bg: string;
  logoBrandColor: string;
  visaColor: string;
  textColor: string;
  accentColor: string;
  pattern: string | null;
  /** Image path for front background (e.g. /card1.png). Falls back to procedural if missing. */
  frontImage?: string;
  /** Overlay text/elements color when using frontImage */
  overlayColor?: string;
  /** Back face solid background color */
  backColor?: string;
}

interface Card3DProps {
  skin: CardSkin;
  displayName: string;
  /** normalised mouse position inside the sky panel: {x: -1…1, y: -1…1} or null */
  mousePos?: { x: number; y: number } | null;
  onShowingBackChange?: (back: boolean) => void;
  /** When this increments, flip the card to the other side */
  flipTrigger?: number;
}

/* ═══════════════════════════════════════════
 *  SVG Path data (from CriterionLogo.tsx)
 * ═══════════════════════════════════════════ */
const SYMBOL_PATH =
  "M198.203 185.63L381.138 2.69576C382.864 0.969693 385.205 0 387.646 0H757.029C765.229 0 769.335 9.91398 763.537 15.7121L593.618 185.63C591.892 187.356 589.551 188.326 587.11 188.326H372.07C369.629 188.326 367.288 189.296 365.562 191.022L272.106 284.477C266.308 290.276 270.415 300.189 278.615 300.189H342.831C345.284 300.189 347.635 301.168 349.363 302.909L574.641 529.848C580.406 535.656 576.292 545.536 568.109 545.536H329.965C327.512 545.536 325.161 544.557 323.433 542.816L85.2814 302.909C83.5534 301.168 81.2021 300.189 78.7494 300.189H9.22239C1.02255 300.189 -3.08393 290.275 2.71423 284.477L96.1697 191.022C97.8958 189.296 100.237 188.326 102.678 188.326H191.694C194.135 188.326 196.477 187.356 198.203 185.63Z";

const VISA_PATH =
  "M293.2 348.73L311.56 163.82H342.94L324.57 348.73H293.2ZM508.96 167.53C502.26 164.7 491.46 161.59 478.11 161.59C446.42 161.59 423.93 178.02 423.73 201.69C423.35 219.33 439.71 229.22 452.11 235.22C464.83 241.36 469.19 245.39 469.13 251.04C469 259.59 458.82 263.49 449.35 263.49C436.05 263.49 428.96 261.66 418.04 256.91L413.79 254.9L409.16 282.49C417.15 286.15 432.4 289.38 448.24 289.55C481.85 289.55 503.91 273.33 504.22 248.02C504.35 234.05 495.72 223.36 477.36 214.63C466 208.83 459.01 204.98 459.08 198.92C459.08 193.59 465.13 187.88 478.18 187.88C489.07 187.68 496.92 190.39 503.04 193.22L506.04 194.68L510.8 167.89L508.96 167.53ZM568.86 163.82C561.53 163.82 556 167.01 552.52 174.28L505.71 348.73H539.25L545.89 329.71L587.2 329.71L591.09 348.73H620.74L594.85 163.82H568.86ZM555.38 304.54C557.93 297.87 569.38 266.38 569.38 266.38C569.18 266.77 571.86 259.69 573.39 255.19L575.52 265.33L582.48 304.54H555.38ZM241.87 163.82L210.5 287.51L207.17 272.08C201.37 252.33 183.27 230.93 163.02 220.22L191.39 348.59L225.19 348.53L275.73 163.82H241.87ZM182.92 163.82H131.41L130.92 166.69C171.18 176.64 198.17 201.41 207.17 272.08L197.86 175.27C196.24 167.35 190.4 164.16 182.92 163.82Z";

const LOGO_PATHS = {
  c: "M265.411 569.853C106.945 569.853 0 455.882 0 291.172C0 115.532 110.848 0 279.462 0C356.191 0 410.94 45.488 428.548 64.5636C446.156 83.6393 463.765 111.519 463.765 111.519L473.534 132.28C474.45 134.226 473.03 136.464 470.879 136.464H428.548C385.184 78.5021 347.373 48.3984 273.217 48.3984C146.757 48.3984 68.6946 131.925 68.6946 266.972C68.6946 412.948 159.247 507.403 293.513 507.403C358.967 507.403 413.534 467.941 450.558 421.131H478.438C455.875 504.174 372.39 569.853 265.411 569.853Z",
  r1: "M515.526 558.156C509.986 558.156 506.846 551.825 510.168 547.391C527.841 523.807 527.841 522.421 527.841 500.39V253.714C527.841 234.18 528.423 222.783 510.024 204.978C506.014 201.097 507.614 194.083 513.045 192.796L580.458 176.83C584.68 175.83 588.73 179.033 588.73 183.372V262.301C612.929 203.754 646.496 172.529 698.797 172.529C711.431 172.529 722.933 174.229 730.889 177.145C733.279 178.021 734.706 180.383 734.706 182.929V228.957C734.706 233.493 730.3 236.732 725.87 235.758C715.865 233.559 704.971 232.637 691.772 232.637C650.757 232.637 613.578 250.282 594.685 296.218C594.36 297.009 594.194 297.868 594.194 298.723V501.17C594.194 520.376 594.194 522.706 616.435 546.819C620.421 551.14 617.388 558.156 611.509 558.156H515.526Z",
  i1: "M773.957 558.61C768.407 558.61 765.262 552.267 768.589 547.826C786.293 524.201 786.293 522.813 786.293 500.743V290.668C786.293 271.769 776.864 267.026 768.191 260.937C762.165 256.737 768.191 251.969 771.504 248.646L843.012 176.739C847.422 172.329 852.761 175.269 852.761 180.969V499.961C852.761 520.131 852.761 522.361 870.918 547.917C874.094 552.388 870.931 558.61 865.447 558.61H773.957ZM819.918 101.152C791.767 101.152 770.653 80.8207 770.653 53.4514C770.653 26.0821 791.767 4.96875 819.918 4.96875C847.287 4.96875 868.401 26.0821 868.401 53.4514C868.401 80.8207 847.287 101.152 819.918 101.152Z",
  t: "M1077.84 569.855C1001.33 569.855 966.987 521.457 966.987 457.446V233.105C966.987 229.392 963.978 226.382 960.265 226.382H902.346C896.313 226.382 893.36 218.969 897.656 214.842L1021.2 91.1516C1025.46 87.0039 1032.61 90.0226 1032.61 95.9686L1033.34 173.603C1033.34 177.316 1036.35 180.325 1040.06 180.325H1193.83C1198.72 180.325 1201.98 185.393 1199.94 189.846L1185.02 222.457C1183.92 224.848 1181.53 226.382 1178.9 226.382H1040.06C1036.35 226.382 1033.34 229.392 1033.34 233.105V434.027C1033.34 486.329 1063.78 511.308 1110.62 511.308C1137.32 511.308 1161.13 503.868 1179.93 489.588C1185.5 485.36 1194.4 490.026 1191.87 496.544C1173.76 543.157 1129.78 569.855 1077.84 569.855Z",
  e: "M1400.26 569.848C1285.51 569.848 1203.55 497.251 1203.55 370.79C1203.55 259.942 1269.12 168.609 1389.33 168.609C1498.76 168.609 1564.68 237.617 1566.5 347.692C1566.56 351.386 1563.55 354.397 1559.86 354.397H1271.46C1271.03 354.397 1270.68 354.747 1270.68 355.178C1270.68 458.22 1338.59 510.521 1426.8 510.521C1475.11 510.521 1514.85 498.421 1542.36 471.789C1547.46 466.852 1556.71 470.81 1554.53 477.567C1536.74 532.764 1482.99 569.848 1400.26 569.848ZM1272.12 313.615C1271.7 317.501 1274.79 320.83 1278.7 320.83H1491.74C1495.51 320.83 1498.56 317.717 1498.32 313.95C1494.35 250.898 1456.28 202.176 1386.21 202.176C1320.55 202.176 1279.7 244.495 1272.12 313.615Z",
  r2: "M1611.36 558.156C1605.82 558.156 1602.68 551.825 1606 547.391C1623.68 523.807 1623.68 522.421 1623.68 500.39V253.714C1623.68 234.18 1624.26 222.783 1605.86 204.978C1601.85 201.097 1603.45 194.083 1608.88 192.796L1676.29 176.83C1680.52 175.83 1684.57 179.033 1684.57 183.372V262.301C1708.76 203.754 1742.33 172.529 1794.63 172.529C1807.27 172.529 1818.77 174.229 1826.72 177.145C1829.12 178.021 1830.54 180.383 1830.54 182.929V228.957C1830.54 233.493 1826.14 236.732 1821.71 235.758C1811.7 233.559 1800.81 232.637 1787.61 232.637C1746.59 232.637 1709.41 250.282 1690.52 296.218C1690.2 297.009 1690.03 297.868 1690.03 298.723V501.17C1690.03 520.376 1690.03 522.706 1712.27 546.819C1716.26 551.14 1713.22 558.156 1707.35 558.156H1611.36Z",
  i2: "M1869.79 558.61C1864.24 558.61 1861.1 552.267 1864.43 547.826C1882.13 524.201 1882.13 522.813 1882.13 500.743V290.668C1882.13 271.769 1872.7 267.026 1864.03 260.937C1858 256.737 1864.03 251.969 1867.34 248.646L1938.85 176.739C1943.26 172.329 1948.6 175.269 1948.6 180.969V499.961C1948.6 520.131 1948.6 522.361 1966.75 547.917C1969.93 552.388 1966.77 558.61 1961.28 558.61H1869.79ZM1915.75 101.152C1887.6 101.152 1866.49 80.8207 1866.49 53.4514C1866.49 26.0821 1887.6 4.96875 1915.75 4.96875C1943.12 4.96875 1964.24 26.0821 1964.24 53.4514C1964.24 80.8207 1943.12 101.152 1915.75 101.152Z",
  o: "M2198.68 569.848C2083.15 569.848 1999.62 486.322 1999.62 368.448C1999.62 251.355 2083.15 168.609 2198.68 168.609C2314.21 168.609 2396.96 250.575 2396.96 368.448C2396.96 486.322 2313.43 569.848 2198.68 569.848ZM2203.36 527.695C2277.52 527.695 2327.48 470.709 2327.48 382.499C2327.48 279.457 2274.4 210.763 2194 210.763C2118.28 210.763 2070.66 267.748 2070.66 355.958C2070.66 459 2123.74 527.695 2203.36 527.695Z",
  n: "M2705.43 558.139C2699.89 558.139 2696.75 551.808 2700.08 547.374C2717.75 523.79 2717.75 522.404 2717.75 500.373V327.856C2717.75 260.723 2678.72 222.472 2618.61 222.472C2571.57 222.472 2538.24 243.803 2517.87 282.7C2517.38 283.641 2517.13 284.695 2517.13 285.756V499.592C2517.13 519.727 2517.13 521.954 2535.25 547.465C2538.42 551.928 2535.27 558.139 2529.79 558.139H2438.46C2432.92 558.139 2429.78 551.808 2433.1 547.374C2450.78 523.79 2450.78 522.404 2450.78 500.373V258.381C2450.78 239.515 2450.78 224.138 2432.71 205.224C2428.85 201.189 2430.57 194.17 2436.01 192.955L2508.94 176.681C2513.14 175.744 2517.13 178.939 2517.13 183.243V241.207C2546.01 192.809 2591.29 168.609 2645.93 168.609C2728.68 168.609 2783.32 224.033 2783.32 309.902V501.154C2783.32 520.561 2783.32 522.736 2800.26 547.571C2803.31 552.046 2800.14 558.139 2794.72 558.139H2705.43Z",
};

/* ═══════════════════════════════════════════
 *  Color helpers
 * ═══════════════════════════════════════════ */
const COLOR_MAP: Record<string, string> = {
  dark: "#132E21",
  white: "#FFFFFF",
  blue: "#64E1FB",
  green: "#C1D463",
};
function resolveColor(c: string) {
  return COLOR_MAP[c] ?? c;
}

/* ═══════════════════════════════════════════
 *  Canvas 2D Texture Renderers
 *  Resolution: 1024 x 645 (credit card ratio)
 * ═══════════════════════════════════════════ */
const TEX_W = 1024;
const TEX_H = 645;

function hexToRgba(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/** Darken a hex color by a factor 0-1 (0=no change, 1=black) */
function darkenHex(hex: string, factor: number) {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * (1 - factor));
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * (1 - factor));
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * (1 - factor));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function drawCriterionLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  color: string
) {
  const fill = resolveColor(color);
  const scale = height / 569.855;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = fill;
  ctx.save();
  ctx.translate(0, 12.99);
  ctx.fill(new Path2D(SYMBOL_PATH));
  ctx.restore();
  ctx.save();
  ctx.translate(793.27, 0);
  Object.values(LOGO_PATHS).forEach((d) => ctx.fill(new Path2D(d)));
  ctx.restore();
  ctx.restore();
}

function drawCriterionSymbol(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  const fill = resolveColor(color);
  const scale = size / 766.251;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = fill;
  ctx.fill(new Path2D(SYMBOL_PATH));
  ctx.restore();
}

function drawVisaLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  color: string
) {
  const fill =
    color === "dark" ? "#132E21" : color === "white" ? "#FFFFFF" : color;
  const scale = height / 500;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = fill;
  ctx.fill(new Path2D(VISA_PATH));
  ctx.restore();
}

function drawGeoPattern(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const sx = w / 856;
  const sy = h / 540;
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  const lines: [number, number, number, number][] = [
    [0, 80, 300, 80], [300, 80, 420, 200], [420, 200, 700, 200],
    [700, 200, 856, 80], [0, 300, 200, 300], [200, 300, 350, 420],
    [350, 420, 600, 420], [600, 420, 750, 300], [750, 300, 856, 300],
    [420, 200, 350, 300], [350, 300, 200, 300], [700, 200, 750, 300],
    [0, 500, 150, 380], [150, 380, 350, 420], [600, 420, 856, 540],
  ];
  lines.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1 * sx, y1 * sy);
    ctx.lineTo(x2 * sx, y2 * sy);
    ctx.stroke();
  });
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath(); ctx.moveTo(500 * sx, 0); ctx.lineTo(420 * sx, 200 * sy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(856 * sx, 0); ctx.lineTo(700 * sx, 200 * sy); ctx.stroke();
  ctx.restore();
}

function drawBoldPattern(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#C1D463");
  grad.addColorStop(0.15, "#C1D463");
  grad.addColorStop(0.15, "#132E21");
  grad.addColorStop(0.3, "#132E21");
  grad.addColorStop(0.3, "#F1F6EC");
  grad.addColorStop(0.45, "#F1F6EC");
  grad.addColorStop(0.45, "#64E1FB");
  grad.addColorStop(0.6, "#64E1FB");
  grad.addColorStop(0.6, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  const syms: [number, number, number, string, number][] = [
    [-w * 0.04, h * 0.2, w * 0.6, "#64E1FB", 0.9],
    [w * 0.45, h * 0.3, w * 0.5, "#132E21", 0.9],
    [w * 0.15, h * 0.35, w * 0.45, "#C1D463", 0.8],
  ];
  syms.forEach(([sx, sy, sz, col, alpha]) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    drawCriterionSymbol(ctx, sx, sy, sz, col);
    ctx.restore();
  });
}

/** Capitalize first letter of each word */
function toTitleCase(s: string) {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function drawSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number
) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
}

function renderFrontTexture(
  ctx: CanvasRenderingContext2D,
  skin: CardSkin,
  displayName: string,
  frontImage: HTMLImageElement | null
) {
  const w = TEX_W;
  const h = TEX_H;
  const cornerR = w * 0.035;

  // Clip to rounded rectangle so ALL content respects rounded corners
  ctx.save();
  roundRect(ctx, 0, 0, w, h, cornerR);
  ctx.clip();

  // Background: image if available, else procedural bg + pattern
  const useImage = !!(frontImage && frontImage.complete && frontImage.naturalWidth);
  if (useImage) {
    ctx.drawImage(frontImage, 0, 0, w, h);
    // No overlay/gradient on card images — preserve realistic colors
  } else {
    ctx.fillStyle = skin.bg;
    ctx.fillRect(0, 0, w, h);
    if (skin.pattern === "geometric") drawGeoPattern(ctx, w, h);
    if (skin.pattern === "bold") drawBoldPattern(ctx, w, h);
    // Specular highlight band — only for procedural cards
    const grad = ctx.createLinearGradient(0, h, w, 0);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.35, "rgba(255,255,255,0)");
    grad.addColorStop(0.48, "rgba(255,255,255,0.04)");
    grad.addColorStop(0.52, "rgba(255,255,255,0.04)");
    grad.addColorStop(0.65, "rgba(255,255,255,0)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  const overlayColor = useImage && skin.overlayColor ? skin.overlayColor : skin.textColor;

  // Criterion Logo — skip when using image
  if (!useImage) {
    const logoH = h * 0.06;
    const logoW = logoH * (3594.813 / 569.855);
    drawCriterionLogo(ctx, w - logoW - w * 0.07, h * 0.08, logoH, skin.logoBrandColor);
  }

  // Chip rectangle
  const chipW = w * 0.09;
  const chipH = h * 0.11;
  const chipX = w * 0.07;
  const chipY = h * 0.38;
  const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
  chipGrad.addColorStop(0, "#e8d5a3");
  chipGrad.addColorStop(0.3, "#f5ecd0");
  chipGrad.addColorStop(0.5, "#dbc48e");
  chipGrad.addColorStop(0.7, "#f0e4bf");
  chipGrad.addColorStop(1, "#c9ab6a");
  ctx.fillStyle = chipGrad;
  roundRect(ctx, chipX, chipY, chipW, chipH, 6);
  ctx.fill();
  ctx.strokeStyle = "rgba(160,130,70,0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(chipX + chipW * 0.33, chipY);
  ctx.lineTo(chipX + chipW * 0.33, chipY + chipH);
  ctx.moveTo(chipX + chipW * 0.66, chipY);
  ctx.lineTo(chipX + chipW * 0.66, chipY + chipH);
  ctx.moveTo(chipX, chipY + chipH * 0.5);
  ctx.lineTo(chipX + chipW, chipY + chipH * 0.5);
  ctx.stroke();

  // Contactless icon
  const ctX = chipX + chipW + w * 0.025;
  const ctY = chipY + chipH * 0.5;
  ctx.strokeStyle = hexToRgba(overlayColor, 0.5);
  ctx.lineWidth = 2;
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(ctX, ctY, i * 6, -Math.PI * 0.35, Math.PI * 0.35);
    ctx.stroke();
  }

  // Display name (leave blank if empty) — title case, Libre Franklin Medium
  if (displayName.trim()) {
    ctx.fillStyle = overlayColor;
    ctx.font = `500 ${h * 0.05}px "Libre Franklin", Arial, sans-serif`;
    drawSpacedText(ctx, toTitleCase(displayName), w * 0.07, h * 0.81, 1);
  }

  // VISA logo — skip when using image
  if (!useImage) {
    const visaH = h * 0.068;
    drawVisaLogo(ctx, w - visaH * (780 / 500) - w * 0.07, h - visaH - h * 0.06, visaH, skin.visaColor);
  }

  ctx.restore(); // end rounded clip
}

function renderBackTexture(ctx: CanvasRenderingContext2D, skin: CardSkin) {
  const w = TEX_W;
  const h = TEX_H;
  const cornerR = w * 0.035;

  // Clip to rounded rectangle
  ctx.save();
  roundRect(ctx, 0, 0, w, h, cornerR);
  ctx.clip();

  // Back color: explicit backColor or derived from accent
  const backColor = skin.backColor ?? darkenHex(resolveColor(skin.accentColor), 0.35);
  ctx.fillStyle = backColor;
  ctx.fillRect(0, 0, w, h);

  // Back text/content: card2 and card4 use #132E21 with lower opacity; others use white
  const useDarkBackText = skin.id === "blue" || skin.id === "bold";
  const backTextBase = useDarkBackText ? "#132E21" : "#FFFFFF";
  const backTextAlpha = useDarkBackText ? 0.5 : 0.45;
  const backTextFill = hexToRgba(backTextBase, backTextAlpha);
  const backBoxAlpha = useDarkBackText ? 0.06 : 0.08;
  const backBoxFill = hexToRgba(backTextBase, backBoxAlpha);

  // Signature strip
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(0, h * 0.1, w, h * 0.14);

  // Signature / CVV boxes
  ctx.fillStyle = backBoxFill;
  roundRect(ctx, w * 0.06, h * 0.35, w * 0.65, h * 0.12, 6);
  ctx.fill();

  ctx.fillStyle = hexToRgba(backTextBase, backBoxAlpha * 0.75);
  roundRect(ctx, w * 0.73, h * 0.35, w * 0.2, h * 0.12, 6);
  ctx.fill();
  ctx.fillStyle = hexToRgba(backTextBase, useDarkBackText ? 0.5 : 0.6);
  ctx.font = `400 ${h * 0.04}px "Libre Franklin", Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("***", w * 0.83, h * 0.43);
  ctx.textAlign = "start";

  // Disclaimer
  ctx.fillStyle = backTextFill;
  ctx.font = `400 ${h * 0.025}px "Libre Franklin", Arial, sans-serif`;
  ctx.fillText("This card is the property of Criterion", w * 0.06, h * 0.6);
  ctx.fillText("and must be returned upon request.", w * 0.06, h * 0.64);

  // Lower section: symbol + card number dots side by side
  const symbolX = w * 0.06;
  const symbolY = h * 0.78;
  const symbolH = h * 0.12;
  drawCriterionSymbol(ctx, symbolX, symbolY, symbolH, hexToRgba(backTextBase, 0.25));

  // Card number dots — next to symbol in lower part (with extra spacing)
  const numStartX = symbolX + symbolH * 1.5;
  const numY = symbolY + symbolH * 0.5;
  ctx.fillStyle = hexToRgba(backTextBase, 0.35);
  for (let g = 0; g < 4; g++) {
    for (let d = 0; d < 4; d++) {
      const dx = numStartX + g * w * 0.14 + d * 10;
      ctx.beginPath();
      ctx.arc(dx, numY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // VALID THRU — right corner, above website
  ctx.fillStyle = backTextFill;
  ctx.font = `400 ${h * 0.028}px "Libre Franklin", Arial, sans-serif`;
  ctx.textAlign = "right";
  ctx.fillText("VALID THRU 12/29", w * 0.94, h * 0.86);
  ctx.fillText("criterioncard.com", w * 0.94, h * 0.92);
  ctx.textAlign = "start";

  ctx.restore(); // end rounded clip
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ═══════════════════════════════════════════
 *  Texture creation helpers (no hooks)
 * ═══════════════════════════════════════════ */
function createCanvasTexture(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return { canvas, texture: tex };
}

function updateTexture(
  canvas: HTMLCanvasElement,
  texture: THREE.CanvasTexture,
  renderFn: (ctx: CanvasRenderingContext2D) => void
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderFn(ctx);
  texture.needsUpdate = true;
}

/* ═══════════════════════════════════════════
 *  Rounded-corner card geometry (ExtrudeGeometry)
 *  Creates 3 material groups: [edge, front, back]
 * ═══════════════════════════════════════════ */
function createRoundedCardGeometry(
  w: number, h: number, depth: number, radius: number
): THREE.BufferGeometry {
  const hw = w / 2, hh = h / 2, r = Math.min(radius, hw, hh);

  // Rounded rectangle shape centered at origin
  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    curveSegments: 8,
  });

  // Center along z so the card is symmetrical
  geometry.translate(0, 0, -depth / 2);

  // Remap UVs from world coords to 0-1 range for textures
  const uv = geometry.getAttribute("uv") as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(
      i,
      (uv.getX(i) + hw) / w,
      (uv.getY(i) + hh) / h
    );
  }

  // Classify every triangle as front / back / side using face normals.
  // ExtrudeGeometry may be non-indexed, so we work with raw vertex triples.
  const normal = geometry.getAttribute("normal") as THREE.BufferAttribute;
  const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
  const vertCount = pos.count;
  const triCount = vertCount / 3;

  // We'll rebuild as an indexed geometry with sorted groups.
  // Collect vertex indices (0,1,2), (3,4,5), … per category.
  const frontTris: number[] = [];  // flat list of vertex indices
  const backTris: number[] = [];
  const sideTris: number[] = [];

  for (let t = 0; t < triCount; t++) {
    const i0 = t * 3, i1 = i0 + 1, i2 = i0 + 2;
    const nz = (normal.getZ(i0) + normal.getZ(i1) + normal.getZ(i2)) / 3;

    if (nz > 0.5) { frontTris.push(i0, i1, i2); }
    else if (nz < -0.5) { backTris.push(i0, i1, i2); }
    else { sideTris.push(i0, i1, i2); }
  }

  // Flip U for back-face vertices so texture reads correctly when viewed from behind
  const backVerts = new Set(backTris);
  backVerts.forEach((i) => {
    uv.setX(i, 1 - uv.getX(i));
  });
  uv.needsUpdate = true;

  // Build index buffer sorted by group: [edge, front, back]
  const indices = [...sideTris, ...frontTris, ...backTris];
  geometry.setIndex(indices);

  geometry.clearGroups();
  geometry.addGroup(0, sideTris.length, 0);                               // material 0 = edge
  geometry.addGroup(sideTris.length, frontTris.length, 1);                // material 1 = front
  geometry.addGroup(sideTris.length + frontTris.length, backTris.length, 2); // material 2 = back

  return geometry;
}

/* ═══════════════════════════════════════════
 *  Procedural environment map (no file loading)
 * ═══════════════════════════════════════════ */
function useProceduralEnvMap() {
  const { gl } = useThree();

  return useMemo(() => {
    const pmremGen = new THREE.PMREMGenerator(gl);
    pmremGen.compileEquirectangularShader();

    const scene = new THREE.Scene();
    // Gradient sky dome
    const topColor = new THREE.Color("#87CEEB");
    const bottomColor = new THREE.Color("#2c5f3f");
    const envGeo = new THREE.SphereGeometry(10, 32, 32);
    const envMat = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: topColor },
        bottomColor: { value: bottomColor },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(h, 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide,
    });
    const envMesh = new THREE.Mesh(envGeo, envMat);
    scene.add(envMesh);

    // Bright spot (simulates sun)
    const spotGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const spotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const spotMesh = new THREE.Mesh(spotGeo, spotMat);
    spotMesh.position.set(5, 6, 3);
    scene.add(spotMesh);

    const envMap = pmremGen.fromScene(scene, 0, 0.1, 100).texture;
    pmremGen.dispose();
    envGeo.dispose();
    envMat.dispose();
    spotGeo.dispose();
    spotMat.dispose();

    return envMap;
  }, [gl]);
}

/* ═══════════════════════════════════════════
 *  3D Card Mesh (inside Canvas)
 * ═══════════════════════════════════════════ */
function CardMesh({ skin, displayName, mousePos, onShowingBackChange, flipTrigger }: Card3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();

  // Card dimensions
  const CARD_W = 3.4;
  const CARD_H = CARD_W / 1.586;
  const CARD_D = 0.06;
  const CARD_R = CARD_W * 0.035; // corner radius matching texture

  // Procedural env map
  const envMap = useProceduralEnvMap();

  /* ─── Textures (stable refs, updated imperatively) ─── */
  const frontRes = useMemo(() => createCanvasTexture(TEX_W, TEX_H), []);
  const backRes = useMemo(() => createCanvasTexture(TEX_W, TEX_H), []);

  // Normal map
  const normalMap = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 322;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "rgb(128,128,255)";
    ctx.fillRect(0, 0, 512, 322);
    for (let y = 0; y < 322; y += 2) {
      const v = 128 + (Math.random() - 0.5) * 12;
      ctx.fillStyle = `rgb(128,${Math.floor(v)},255)`;
      ctx.fillRect(0, y, 512, 1);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.NoColorSpace;
    return tex;
  }, []);

  // Cache for loaded front images
  const imageCacheRef = useRef<Record<string, HTMLImageElement>>({});
  const [imagesReady, setImagesReady] = useState(0);

  // Load front images when skin has frontImage
  useEffect(() => {
    const src = skin.frontImage;
    if (!src) {
      setImagesReady((n) => n + 1);
      return;
    }
    if (imageCacheRef.current[src]) {
      setImagesReady((n) => n + 1);
      return;
    }
    const img = new Image();
    img.onload = () => {
      imageCacheRef.current[src] = img;
      setImagesReady((n) => n + 1);
    };
    img.onerror = () => setImagesReady((n) => n + 1);
    img.src = src;
  }, [skin.frontImage]);

  // Update front texture when skin/name changes
  const skinRef = useRef(skin);
  const nameRef = useRef(displayName);
  skinRef.current = skin;
  nameRef.current = displayName;

  // Initial render + re-render on changes
  useEffect(() => {
    const frontImg = skin.frontImage ? imageCacheRef.current[skin.frontImage] ?? null : null;
    updateTexture(frontRes.canvas, frontRes.texture, (ctx) =>
      renderFrontTexture(ctx, skin, displayName, frontImg)
    );
  }, [skin.id, skin.bg, skin.textColor, skin.frontImage, displayName, imagesReady, frontRes]);

  useEffect(() => {
    updateTexture(backRes.canvas, backRes.texture, (ctx) =>
      renderBackTexture(ctx, skin)
    );
  }, [skin.id, skin.bg, skin.textColor, backRes]);

  /* ─── Materials (stable, update properties imperatively) ─── */
  // Image-based cards: MeshBasicMaterial to preserve exact design colors (no PBR lighting alter)
  // Procedural cards: MeshPhysicalMaterial for proper lighting/shading
  const frontMat = useMemo(() => {
    if (skin.frontImage) {
      return new THREE.MeshBasicMaterial({
        map: frontRes.texture,
      });
    }
    return new THREE.MeshPhysicalMaterial({
      map: frontRes.texture,
      color: 0xffffff,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.15, 0.15),
      roughness: 0.3,
      metalness: 0.02,
      clearcoat: 0.2,
      clearcoatRoughness: 0.3,
      reflectivity: 0.2,
      envMap: envMap,
      envMapIntensity: 0,
    });
  }, [frontRes.texture, normalMap, envMap, skin.frontImage]);

  const backMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: backRes.texture,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.15, 0.15),
        roughness: 0.28,
        metalness: 0.05,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
        reflectivity: 0.3,
        envMap: envMap,
        envMapIntensity: 0,
      }),
    [backRes.texture, normalMap, envMap]
  );

  // Edge material — visible now that the card has real depth
  const edgeMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(skin.bg).multiplyScalar(0.7),
      roughness: 0.4,
      metalness: 0.05,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      envMap: envMap,
      envMapIntensity: 0.4,
    });
  }, [skin.bg, envMap]);

  // Rounded-corner geometry with 3 material groups: [edge, front, back]
  const geometry = useMemo(
    () => createRoundedCardGeometry(CARD_W, CARD_H, CARD_D, CARD_R),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const materials = useMemo(
    () => [edgeMat, frontMat, backMat],
    [edgeMat, frontMat, backMat]
  );

  /* ─── Drag + float state (all refs, no React state) ─── */
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const dragStartRotY = useRef(0);
  const dragStartRotX = useRef(0);
  const velocityY = useRef(0);
  const lastPointerX = useRef(0);
  const lastPointerTime = useRef(0);
  const targetRotY = useRef(0);
  const targetRotX = useRef(0.05);
  const currentRotY = useRef(0);
  const currentRotX = useRef(0.05);
  const idleActive = useRef(true);
  const startTime = useRef(Date.now());
  const momentumActive = useRef(false);
  const lastShowingBack = useRef(false);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  // Entrance animation: tilt left -> right -> settle, with vertical lean back
  const entranceStartTime = useRef<number | null>(Date.now());
  const entranceDuration = 2; // seconds
  // Flip-on-click: when flipTrigger changes, animate to opposite side
  const lastFlipTrigger = useRef(flipTrigger ?? 0);
  const flipTargetRotY = useRef<number | null>(null);
  const returnToFrontAt = useRef<number | null>(null); // 2s after showing back, flip to front

  // Keep mousePos ref in sync
  useEffect(() => {
    mousePosRef.current = mousePos ?? null;
  }, [mousePos]);

  // When flipTrigger increments, queue flip to opposite side
  useEffect(() => {
    const trigger = flipTrigger ?? 0;
    if (trigger !== lastFlipTrigger.current) {
      lastFlipTrigger.current = trigger;
      const normY = ((currentRotY.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const isBack = normY > Math.PI / 2 && normY < (Math.PI * 3) / 2;
      flipTargetRotY.current = isBack ? 0 : Math.PI;
      idleActive.current = false;
      momentumActive.current = false;
    }
  }, [flipTrigger]);

  /* ─── Pointer handlers on the canvas DOM element ─── */
  useEffect(() => {
    const dom = gl.domElement;
    dom.style.cursor = "grab";

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isDragging.current = true;
      idleActive.current = false;
      momentumActive.current = false;
      dragStartX.current = e.clientX;
      dragStartY.current = e.clientY;
      dragStartRotY.current = currentRotY.current;
      dragStartRotX.current = currentRotX.current;
      lastPointerX.current = e.clientX;
      lastPointerTime.current = Date.now();
      velocityY.current = 0;
      dom.style.cursor = "grabbing";
      try {
        dom.setPointerCapture(e.pointerId);
      } catch {
        // ignore if pointer capture fails
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - dragStartX.current;
      const dy = e.clientY - dragStartY.current;
      const now = Date.now();
      const dt = Math.max(now - lastPointerTime.current, 1);
      velocityY.current = (e.clientX - lastPointerX.current) / dt;
      lastPointerX.current = e.clientX;
      lastPointerTime.current = now;
      targetRotY.current = dragStartRotY.current + dx * 0.008;
      // Y-axis tilt with constraints (±0.3 rad max)
      const rawTiltX = dragStartRotX.current - dy * 0.004;
      targetRotX.current = THREE.MathUtils.clamp(rawTiltX, -0.3, 0.3);
    };

    const onUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      dom.style.cursor = "grab";
      momentumActive.current = true;
    };

    dom.addEventListener("pointerdown", onDown);
    dom.addEventListener("pointermove", onMove);
    dom.addEventListener("pointerup", onUp);
    dom.addEventListener("pointercancel", onUp);

    return () => {
      dom.removeEventListener("pointerdown", onDown);
      dom.removeEventListener("pointermove", onMove);
      dom.removeEventListener("pointerup", onUp);
      dom.removeEventListener("pointercancel", onUp);
    };
  }, [gl]);

  /* ─── Animation loop ─── */
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const d = Math.min(delta, 0.05);

    // Entrance: tilt left -> right -> settle, with vertical lean back (bottom forward)
    if (entranceStartTime.current !== null) {
      const elapsed = (Date.now() - entranceStartTime.current) / 1000;
      const t = Math.min(elapsed / entranceDuration, 1);
      // Keyframes: 0% left+lean back, 50% right+max lean back, 100% settle
      // Negative rotX = top away, bottom forward (lean back)
      let rotY: number;
      let rotX: number;
      if (t < 0.5) {
        const u = t * 2; // 0..1 over first half
        const ease = 1 - (1 - u) * (1 - u);
        rotY = -0.45 + (0.35 - -0.45) * ease;
        rotX = -0.25 + (-0.4 - -0.25) * ease;
      } else {
        const u = (t - 0.5) * 2; // 0..1 over second half
        const ease = 1 - (1 - u) * (1 - u);
        rotY = 0.35 + (-0.08 - 0.35) * ease;
        rotX = -0.4 + (-0.06 - -0.4) * ease;
      }
      currentRotY.current = rotY;
      currentRotX.current = rotX;
      groupRef.current.rotation.y = rotY;
      groupRef.current.rotation.x = rotX;
      targetRotY.current = rotY;
      targetRotX.current = rotX;
      if (t >= 1) {
        entranceStartTime.current = null;
        startTime.current = Date.now();
      }
      return;
    }

    // 2s timer: after showing back, flip to front
    if (returnToFrontAt.current !== null && Date.now() >= returnToFrontAt.current) {
      returnToFrontAt.current = null;
      flipTargetRotY.current = 0;
    }

    // Flip-on-click: animate toward target rotation
    if (flipTargetRotY.current !== null) {
      const target = flipTargetRotY.current;
      currentRotY.current += (target - currentRotY.current) * 0.12;
      groupRef.current.rotation.y = currentRotY.current;
      targetRotY.current = currentRotY.current;
      if (Math.abs(currentRotY.current - target) < 0.02) {
        currentRotY.current = target;
        groupRef.current.rotation.y = target;
        flipTargetRotY.current = null;
        startTime.current = Date.now();
        idleActive.current = true;
        if (Math.abs(target - Math.PI) < 0.1) {
          returnToFrontAt.current = Date.now() + 2000;
        } else {
          returnToFrontAt.current = null; // User flipped to front manually
        }
      }
      return;
    }

    if (isDragging.current) {
      currentRotY.current += (targetRotY.current - currentRotY.current) * 0.25;
      currentRotX.current += (targetRotX.current - currentRotX.current) * 0.15;
      groupRef.current.rotation.y = currentRotY.current;
      groupRef.current.rotation.x = currentRotX.current;
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        0,
        0.1
      );
    } else if (momentumActive.current) {
      velocityY.current *= 0.93;
      currentRotY.current += velocityY.current * d * 8;
      targetRotY.current = currentRotY.current;
      groupRef.current.rotation.y = currentRotY.current;
      // Ease X rotation back toward idle
      currentRotX.current += (0.03 - currentRotX.current) * 0.04;
      groupRef.current.rotation.x = currentRotX.current;

      if (Math.abs(velocityY.current) < 0.001) {
        momentumActive.current = false;
        startTime.current = Date.now();
        idleActive.current = true;
      }
    } else if (idleActive.current) {
      const t = (Date.now() - startTime.current) / 1000;
      let idleRotY = Math.sin(t * 0.3) * 0.3 - 0.08;
      let idleRotX = Math.sin(t * 0.4) * 0.07 + 0.03;
      const floatY = Math.sin(t * 0.6) * 0.08;

      // Mouse follow tilt — blend toward mouse when hovering
      const mp = mousePosRef.current;
      if (mp) {
        const mouseFollowY = mp.x * 0.125;  // horizontal follow (+30% sensitivity)
        const mouseFollowX = -mp.y * 0.078; // vertical follow (+30% sensitivity)
        idleRotY += mouseFollowY;
        idleRotX += mouseFollowX;
      }

      currentRotY.current += (idleRotY - currentRotY.current) * 0.03;
      currentRotX.current += (idleRotX - currentRotX.current) * 0.03;
      groupRef.current.rotation.y = currentRotY.current;
      groupRef.current.rotation.x = currentRotX.current;
      groupRef.current.position.y +=
        (floatY - groupRef.current.position.y) * 0.05;
    }

    // Report back/front state only when it changes
    if (onShowingBackChange) {
      const normY =
        ((currentRotY.current % (Math.PI * 2)) + Math.PI * 2) %
        (Math.PI * 2);
      const isBack = normY > Math.PI / 2 && normY < (Math.PI * 3) / 2;
      if (isBack !== lastShowingBack.current) {
        lastShowingBack.current = isBack;
        onShowingBackChange(isBack);
      }
    }
  });

  return (
    <group ref={groupRef} rotation={[-0.25, -0.45, 0]}>
      <mesh geometry={geometry} material={materials} castShadow receiveShadow />
    </group>
  );
}

/* ═══════════════════════════════════════════
 *  Public Component: Card3DCanvas
 * ═══════════════════════════════════════════ */
export default function Card3DCanvas({
  skin,
  displayName,
  mousePos,
  onShowingBackChange,
  flipTrigger,
}: Card3DProps) {
  return (
    <div
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10.2], fov: 35 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.35,
        }}
        style={{ background: "transparent" }}
        onCreated={({ gl: renderer }) => {
          renderer.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[3, 4, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0001}
          />
          {/* Blue directional light removed — single key light is cleaner */}
          <pointLight
            position={[0, -3, 2]}
            intensity={0.2}
            color="#C1D463"
          />

          {/* The card */}
          <CardMesh
            skin={skin}
            displayName={displayName}
            mousePos={mousePos}
            onShowingBackChange={onShowingBackChange}
            flipTrigger={flipTrigger}
          />

          {/* Ground shadow */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1.3, 0]}
            receiveShadow
          >
            <planeGeometry args={[8, 8]} />
            <shadowMaterial transparent opacity={0.15} />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  );
}
