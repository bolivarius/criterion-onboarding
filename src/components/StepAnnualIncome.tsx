"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface StepAnnualIncomeProps {
  data: {
    annualIncome: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const incomeOptions = [
  { id: "under-25k", label: "Under $25,000" },
  { id: "25k-50k", label: "$25,000 - $50,000" },
  { id: "50k-75k", label: "$50,000 - $75,000" },
  { id: "75k-100k", label: "$75,000 - $100,000" },
  { id: "100k-150k", label: "$100,000 - $150,000" },
  { id: "150k-250k", label: "$150,000 - $250,000" },
  { id: "250k-plus", label: "$250,000+" },
  { id: "prefer-not", label: "Prefer not to say" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
};

export function StepAnnualIncome({ data, onChange, onNext, onBack }: StepAnnualIncomeProps) {
  const isValid = !!data.annualIncome;

  return (
    <motion.div
      className="max-w-3xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors mb-8"
        variants={item}
      >
        <ArrowLeft size={16} />
        <span className="text-sm">Back</span>
      </motion.button>

      <motion.div className="mb-10" variants={item}>
        <h1
          className="text-3xl lg:text-5xl mb-4 text-white"
          style={{ fontFamily: "var(--font-freeman), serif" }}
        >
          Your starting point
        </h1>
        <p className="text-white/50 text-lg font-light">
          Approximate annual income
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {incomeOptions.map((option) => {
          const isSelected = data.annualIncome === option.id;
          return (
            <motion.button
              key={option.id}
              onClick={() => onChange("annualIncome", option.id)}
              className={`relative px-6 py-4 rounded-2xl border-2 text-left font-medium transition-all duration-300 ${
                isSelected
                  ? "border-criterion-green-lite bg-criterion-green-lite/15 text-white"
                  : "border-white/[0.08] bg-white/[0.03] text-white/70 hover:bg-white/[0.06] hover:border-white/[0.12]"
              }`}
              variants={item}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {option.label}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        onClick={onNext}
        disabled={!isValid}
        className={`w-full max-w-md mx-auto block py-4 rounded-2xl font-medium text-base transition-all duration-300 ${
          isValid
            ? "bg-criterion-green-lite text-criterion-dark hover:shadow-lg hover:shadow-criterion-green-lite/20 hover:scale-[1.02] active:scale-[0.98]"
            : "bg-white/10 text-white/30 cursor-not-allowed"
        }`}
        variants={item}
        whileTap={isValid ? { scale: 0.98 } : {}}
      >
        Continue
      </motion.button>
    </motion.div>
  );
}
