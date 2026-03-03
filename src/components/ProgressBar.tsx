"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
  onStepClick?: (stepIndex: number) => void;
}

export function ProgressBar({ currentStep, totalSteps, labels, onStepClick }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step indicators — clickable */}
      <div className="flex justify-between mb-3">
        {labels.map((label, index) => {
          const isClickable = onStepClick && index <= currentStep;

          return (
            <div
              key={label}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onClick={isClickable ? () => onStepClick(index) : undefined}
              onKeyDown={isClickable ? (e) => e.key === "Enter" && onStepClick(index) : undefined}
              className={`flex flex-col items-center ${isClickable ? "cursor-pointer transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-criterion-blue/50 rounded-full" : ""}`}
              style={{ width: `${100 / totalSteps}%` }}
            >
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-500 ${
                  index < currentStep
                    ? "bg-criterion-blue text-criterion-dark"
                    : index === currentStep
                    ? "bg-criterion-green-lite text-criterion-dark"
                    : "bg-white/10 text-white/40"
                }`}
                animate={{
                  scale: index === currentStep ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {index < currentStep ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </motion.div>
              <span className={`text-[10px] mt-1.5 text-center leading-tight transition-colors duration-300 ${
                index <= currentStep ? "text-white/80" : "text-white/30"
              }`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/10 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full rounded-full relative shimmer"
          style={{
            background: "linear-gradient(90deg, #64E1FB, #C1D463)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        />
      </div>
    </div>
  );
}
