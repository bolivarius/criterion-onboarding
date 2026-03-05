"use client";

import { motion } from "framer-motion";
import { ArrowLeft, RotateCw } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { CriterionLogo, CriterionSymbol } from "./CriterionLogo";
import dynamic from "next/dynamic";

const Card3DCanvas = dynamic(() => import("./Card3D"), { ssr: false });

interface StepCardCustomizationProps {
  data: {
    cardSkin: string;
    cardName: string;
  };
  personalName: string;
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

/* ─── Card Skins ─── */
const CARD_SKINS = [
  {
    id: "dark",
    label: "Criterion Dark",
    bg: "#0E4129",
    logoBrandColor: "blue",
    visaColor: "white",
    textColor: "#FFFFFF",
    accentColor: "#64E1FB",
    pattern: null as string | null,
    frontImage: "/Card1.png?v=3",
    overlayColor: "#F1F6EC",
    backColor: "#132E21",
  },
  {
    id: "blue",
    label: "Criterion Blue",
    bg: "#64E1FB",
    logoBrandColor: "dark",
    visaColor: "dark",
    textColor: "#132E21",
    accentColor: "#132E21",
    pattern: null as string | null,
    frontImage: "/card2.png?v=2",
    overlayColor: "#132E21",
    backColor: "#64E1FB",
  },
  {
    id: "geo",
    label: "Criterion Geo",
    bg: "#0E4129",
    logoBrandColor: "white",
    visaColor: "white",
    textColor: "#FFFFFF",
    accentColor: "#FFFFFF",
    pattern: "geometric",
    frontImage: "/Card3.png?v=2",
    overlayColor: "#FFFFFF",
    backColor: "#0E4129",
  },
  {
    id: "bold",
    label: "Criterion Bold",
    bg: "#F1F6EC",
    logoBrandColor: "dark",
    visaColor: "white",
    textColor: "#132E21",
    accentColor: "#132E21",
    pattern: "bold",
    frontImage: "/Card4.png?v=3",
    overlayColor: "#FFFFFF",
    backColor: "#D5DAD0",
  },
];

/* ─── VISA logo SVG ─── */
function VisaLogo({ color = "#FFFFFF", className = "" }: { color?: string; className?: string }) {
  const fill = color === "dark" ? "#132E21" : color === "white" ? "#FFFFFF" : color;
  return (
    <svg className={className} viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M293.2 348.73L311.56 163.82H342.94L324.57 348.73H293.2Z" fill={fill} />
      <path d="M508.96 167.53C502.26 164.7 491.46 161.59 478.11 161.59C446.42 161.59 423.93 178.02 423.73 201.69C423.35 219.33 439.71 229.22 452.11 235.22C464.83 241.36 469.19 245.39 469.13 251.04C469 259.59 458.82 263.49 449.35 263.49C436.05 263.49 428.96 261.66 418.04 256.91L413.79 254.9L409.16 282.49C417.15 286.15 432.4 289.38 448.24 289.55C481.85 289.55 503.91 273.33 504.22 248.02C504.35 234.05 495.72 223.36 477.36 214.63C466 208.83 459.01 204.98 459.08 198.92C459.08 193.59 465.13 187.88 478.18 187.88C489.07 187.68 496.92 190.39 503.04 193.22L506.04 194.68L510.8 167.89L508.96 167.53Z" fill={fill} />
      <path d="M568.86 163.82C561.53 163.82 556 167.01 552.52 174.28L505.71 348.73H539.25L545.89 329.71L587.2 329.71L591.09 348.73H620.74L594.85 163.82H568.86ZM555.38 304.54C557.93 297.87 569.38 266.38 569.38 266.38C569.18 266.77 571.86 259.69 573.39 255.19L575.52 265.33L582.48 304.54H555.38Z" fill={fill} />
      <path d="M241.87 163.82L210.5 287.51L207.17 272.08C201.37 252.33 183.27 230.93 163.02 220.22L191.39 348.59L225.19 348.53L275.73 163.82H241.87Z" fill={fill} />
      <path d="M182.92 163.82H131.41L130.92 166.69C171.18 176.64 198.17 201.41 207.17 272.08L197.86 175.27C196.24 167.35 190.4 164.16 182.92 163.82Z" fill={fill} />
    </svg>
  );
}

/* ─── Geometric Pattern ─── */
function GeoPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 856 540" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="300" y1="80" x2="420" y2="200" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="420" y1="200" x2="700" y2="200" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="700" y1="200" x2="856" y2="80" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="0" y1="300" x2="200" y2="300" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="200" y1="300" x2="350" y2="420" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="350" y1="420" x2="600" y2="420" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="600" y1="420" x2="750" y2="300" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="750" y1="300" x2="856" y2="300" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="420" y1="200" x2="350" y2="300" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="350" y1="300" x2="200" y2="300" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="700" y1="200" x2="750" y2="300" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="0" y1="500" x2="150" y2="380" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="150" y1="380" x2="350" y2="420" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="600" y1="420" x2="856" y2="540" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="500" y1="0" x2="420" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <line x1="856" y1="0" x2="700" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    </svg>
  );
}

/* ─── Bold Pattern ─── */
function BoldPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{
        background: `linear-gradient(135deg, #C1D463 0%, #C1D463 15%, #132E21 15%, #132E21 30%, #F1F6EC 30%, #F1F6EC 45%, #64E1FB 45%, #64E1FB 60%, transparent 60%)`,
      }} />
      <div className="absolute -bottom-8 -left-4" style={{ width: "60%", height: "80%", opacity: 0.9 }}>
        <CriterionSymbol className="w-full h-full" color="#64E1FB" />
      </div>
      <div className="absolute -bottom-4 right-[-5%]" style={{ width: "50%", height: "70%", opacity: 0.9 }}>
        <CriterionSymbol className="w-full h-full" color="#132E21" />
      </div>
      <div className="absolute -bottom-12 left-[15%]" style={{ width: "45%", height: "65%", opacity: 0.8 }}>
        <CriterionSymbol className="w-full h-full" color="#C1D463" />
      </div>
    </div>
  );
}

/* Old CSS 3D card face components removed — now rendered via Three.js in Card3D.tsx */

/* ─── Skin Thumbnail ─── */
function SkinThumbnail({
  skin, selected, onClick,
}: {
  skin: typeof CARD_SKINS[0]; selected: boolean; onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const useImage = skin.frontImage && !imgError;

  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden transition-all duration-300 aspect-[1.586/1] ${
        selected
          ? "ring-2 ring-criterion-blue ring-offset-2 ring-offset-criterion-dark scale-105"
          : "opacity-60 hover:opacity-90 hover:scale-[1.02]"
      }`}
    >
      <div className="absolute inset-0" style={{ backgroundColor: skin.bg }}>
        {useImage ? (
          <img
            src={skin.frontImage!}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <>
            {skin.pattern === "geometric" && <GeoPattern />}
            {skin.pattern === "bold" && <BoldPattern />}
          </>
        )}
        {/* No overlay logos when using card image */}
        {!useImage && (
          <div className="relative z-10 h-full flex flex-col justify-between p-2">
            <div className="flex justify-end">
              <CriterionLogo className="h-2 w-auto" color={skin.logoBrandColor} />
            </div>
            <div className="flex justify-end">
              <VisaLogo color={skin.visaColor} className="h-2 w-auto" />
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

/* ─── Animation variants ─── */
const panelVariants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

/* ═══════════════════════════════════════════
 *  Main Component
 * ═══════════════════════════════════════════ */
export function StepCardCustomization({
  data,
  personalName,
  onChange,
  onNext,
  onBack,
  currentStep,
  totalSteps,
  stepLabels,
}: StepCardCustomizationProps) {
  const selectedSkin = CARD_SKINS.find((s) => s.id === data.cardSkin) || CARD_SKINS[0];
  const displayName = data.cardName;

  // Pre-fill card name from form in previous step
  useEffect(() => {
    if (personalName.trim() && !data.cardName.trim()) {
      onChange("cardName", personalName);
    }
  }, [personalName]); // eslint-disable-line react-hooks/exhaustive-deps -- only pre-fill when arriving with empty cardName

  const [showingBack, setShowingBack] = useState(false);

  /* ─── Mouse follow: track normalised position inside the sky panel ─── */
  const skyRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const handleSkyMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = skyRef.current?.getBoundingClientRect();
    if (!rect) return;
    // normalise to -1…1
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x, y });
  }, []);

  const handleSkyMouseLeave = useCallback(() => {
    setMousePos(null);
  }, []);

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* ─── LEFT: Sky background with 3D card ─── */}
      <motion.div
        ref={skyRef}
        className="relative lg:w-[55%] flex items-center justify-center overflow-hidden min-h-[500px] lg:min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        onMouseMove={handleSkyMouseMove}
        onMouseLeave={handleSkyMouseLeave}
      >
        {/* Sky background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/sky-bg.jpg')" }}
        />
        {/* 3D Card (Three.js Canvas — fills the entire sky panel) */}
        <Card3DCanvas
          skin={selectedSkin}
          displayName={displayName}
          mousePos={mousePos}
          onShowingBackChange={setShowingBack}
        />

        {/* Hint — drag icon + disclaimer */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <div className="w-11 h-11 rounded-full border-2 border-white/50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <RotateCw className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <p className="text-sm text-white/60 bg-black/20 backdrop-blur-sm rounded-full px-5 py-2">
            {showingBack ? "Viewing back" : "Viewing front"} · drag to rotate
          </p>
        </div>
      </motion.div>

      {/* ─── RIGHT: Dark panel with step indicators + controls ─── */}
      <motion.div
        className="lg:w-[45%] bg-criterion-dark px-8 lg:px-12 pt-10 lg:pt-14 pb-8 flex flex-col"
        variants={panelVariants}
        initial="hidden"
        animate="show"
      >
        {/* Logo + step counter at top */}
        <motion.div className="flex items-center justify-between mb-6" variants={item}>
          <CriterionLogo className="h-5 w-auto" />
          <span className="text-[11px] text-white/30">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </motion.div>

        {/* Step indicators */}
        <motion.div className="mb-8" variants={item}>
          <div className="flex justify-between mb-3">
            {stepLabels.map((label, index) => (
              <div key={label} className="flex flex-col items-center" style={{ width: `${100 / totalSteps}%` }}>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium transition-all duration-500 ${
                    index < currentStep
                      ? "bg-criterion-blue text-criterion-dark"
                      : index === currentStep
                      ? "bg-criterion-green-lite text-criterion-dark"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {index < currentStep ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-[9px] mt-1 text-center leading-tight transition-colors duration-300 ${
                  index <= currentStep ? "text-white/70" : "text-white/25"
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="h-[3px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #64E1FB, #C1D463)" }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            />
          </div>
        </motion.div>

        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors mb-6"
          variants={item}
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Back</span>
        </motion.button>

        {/* Title */}
        <motion.h1
          className="text-3xl lg:text-4xl mb-2 text-white"
          style={{ fontFamily: "var(--font-freeman), serif" }}
          variants={item}
        >
          Customize your card
        </motion.h1>
        <motion.p className="text-white/50 text-base font-light mb-8" variants={item}>
          Design the perfect card for you.
        </motion.p>

        {/* Controls */}
        <motion.div className="space-y-6 flex-1 flex flex-col" variants={item}>
          {/* Skin selection */}
          <div>
            <label className="block text-xs text-white/50 mb-3 uppercase tracking-wider">
              Card Skin
            </label>
            <div className="grid grid-cols-4 gap-3">
              {CARD_SKINS.map((skin) => (
                <SkinThumbnail
                  key={skin.id}
                  skin={skin}
                  selected={data.cardSkin === skin.id}
                  onClick={() => onChange("cardSkin", skin.id)}
                />
              ))}
            </div>
          </div>

          {/* Name on card */}
          <div>
            <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">
              Name on card
            </label>
            <input
              type="text"
              placeholder={personalName || "Your name"}
              value={data.cardName}
              onChange={(e) => onChange("cardName", e.target.value)}
              maxLength={25}
            />
            <p className="text-[10px] text-white/20 mt-2">
              {(data.cardName || personalName || "").length}/25 characters
            </p>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          <motion.button
            onClick={onNext}
            className="w-full py-4 rounded-2xl font-medium text-base bg-criterion-blue text-criterion-dark hover:shadow-lg hover:shadow-criterion-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            whileTap={{ scale: 0.98 }}
            variants={item}
          >
            Finish
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
