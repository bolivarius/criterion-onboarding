"use client";

import { motion } from "framer-motion";
import { User, Users, ArrowLeft } from "lucide-react";

interface StepAccountTypeProps {
  data: {
    accountType: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const accountTypes = [
  {
    id: "individual",
    icon: User,
    title: "Individual Account",
    tagline: "Built for stability and progression",
    description: "Designed for members who want deeper insights, rewards, and long-term financial readiness.",
    features: [
      "Criterion Score insights and progress tracking",
      "Giving automations + impact summaries",
      "Advanced spend insights & weekly progress email",
      "Virtual card + spend alerts",
      "Priority support",
    ],
    accent: "#64E1FB",
  },
  {
    id: "family",
    icon: Users,
    title: "Family Account",
    tagline: "Built for responsibility and legacy",
    description: "Households planning together.",
    features: [
      "All Essentials features",
      "Multiple linked cards",
      "Parental controls for children",
      "Shared family visibility and tools",
      "Priority support",
    ],
    accent: "#C1D463",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

export function StepAccountType({ data, onChange, onNext, onBack }: StepAccountTypeProps) {
  const isValid = !!data.accountType;

  return (
    <motion.div
      className="max-w-4xl mx-auto"
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
          Choose your account type
        </h1>
        <p className="text-white/50 text-lg font-light">
          Select the account that best fits your profile.
        </p>
      </motion.div>

      {/* Account type cards — more evident selection, larger typography */}
      <div className="grid md:grid-cols-2 gap-6 mb-10 items-stretch">
        {accountTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = data.accountType === type.id;
          return (
            <motion.button
              key={type.id}
              onClick={() => onChange("accountType", type.id)}
              className={`relative text-left pt-6 px-8 pb-8 rounded-2xl border-2 transition-all duration-300 h-full flex flex-col ${
                isSelected
                  ? "border-criterion-green-lite bg-criterion-green-lite/15 shadow-lg shadow-criterion-green-lite/20"
                  : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1]"
              }`}
              variants={item}
              whileHover={{ y: isSelected ? 0 : -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                  isSelected ? "" : "opacity-80"
                }`}
                style={{ backgroundColor: `${type.accent}${isSelected ? "25" : "15"}`, color: type.accent }}
              >
                <Icon size={32} />
              </div>

              <h3 className={`text-xl lg:text-2xl font-semibold mb-1 ${isSelected ? "text-white" : "text-white/90"}`}>
                {type.title}
              </h3>
              <p className="text-sm text-white/60 mb-2 font-medium">{type.tagline}</p>
              <p className="text-base text-white/40 mb-5 leading-relaxed">{type.description}</p>

              <div className="space-y-2.5">
                {type.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-white/50">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: type.accent }} />
                    {feature}
                  </div>
                ))}
              </div>

              {isSelected && (
                <motion.div
                  className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center bg-criterion-green-lite"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#132E21" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        onClick={onNext}
        disabled={!isValid}
        className={`w-full max-w-md mx-auto block py-4 rounded-2xl font-medium text-base transition-all duration-300 ${
          isValid
            ? "bg-criterion-blue text-criterion-dark hover:shadow-lg hover:shadow-criterion-blue/20 hover:scale-[1.02] active:scale-[0.98]"
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
