"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Users,
  GraduationCap,
  Home,
  Briefcase,
  Star,
  TrendingUp,
  Heart,
  Store,
  ScrollText,
  PiggyBank,
  CircleDollarSign,
  ArrowLeft,
  Check,
  LucideIcon,
} from "lucide-react";

interface StepGoalsProps {
  data: {
    priorities: string[];
  };
  onChange: (field: string, value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const priorityOptions: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "emergency-security", label: "Emergency Security", icon: Shield },
  { id: "family-stability", label: "Family Stability", icon: Users },
  { id: "education-fund", label: "Education Fund", icon: GraduationCap },
  { id: "home-ownership", label: "Home Ownership", icon: Home },
  { id: "business-growth", label: "Business Growth", icon: Briefcase },
  { id: "umrah-hajj", label: "Umrah / Hajj", icon: Star },
  { id: "wealth-building", label: "Wealth Building", icon: TrendingUp },
  { id: "giving-more", label: "Giving More", icon: Heart },
  { id: "supporting-muslim-businesses", label: "Supporting Muslim Businesses", icon: Store },
  { id: "retirement-fund", label: "Retirement Fund", icon: PiggyBank },
  { id: "halal-investments", label: "Halal Investments", icon: CircleDollarSign },
  { id: "leaving-legacy", label: "Leaving a Legacy", icon: ScrollText },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
};

export function StepGoals({ data, onChange, onNext, onBack }: StepGoalsProps) {
  const togglePriority = (id: string) => {
    const current = data.priorities || [];
    const updated = current.includes(id)
      ? current.filter((p) => p !== id)
      : [...current, id];
    onChange("priorities", updated);
  };

  const isValid = (data.priorities?.length ?? 0) > 0;

  return (
    <motion.div
      className="flex flex-col h-[calc(100vh-180px)] min-h-[500px] max-w-5xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors mb-4 shrink-0"
        variants={item}
      >
        <ArrowLeft size={16} />
        <span className="text-sm">Back</span>
      </motion.button>

      <motion.div className="mb-4 shrink-0" variants={item}>
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl mb-1 text-white"
          style={{ fontFamily: "var(--font-freeman), serif" }}
        >
          What matters most to you?
        </h1>
        <p className="text-white/50 text-sm font-light">Select all that apply.</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 flex-1 min-h-0 auto-rows-fr">
        {priorityOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = data.priorities?.includes(option.id) ?? false;
          return (
            <motion.button
              key={option.id}
              onClick={() => togglePriority(option.id)}
              className={`relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 text-left min-w-0 min-h-[100px] ${
                isSelected
                  ? "border-criterion-green-lite bg-criterion-green-lite/10"
                  : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1]"
              }`}
              variants={item}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSelected && (
                <motion.div
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-criterion-green-lite flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Check size={14} className="text-criterion-dark" strokeWidth={3} />
                </motion.div>
              )}
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 shrink-0 ${
                  isSelected ? "text-criterion-green-lite" : "text-white/40"
                }`}
              >
                <Icon size={24} />
              </div>
              <span className="text-sm font-medium text-white/90 text-center leading-tight line-clamp-2">
                {option.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        onClick={onNext}
        disabled={!isValid}
        className={`w-full max-w-md mx-auto block py-4 rounded-2xl font-medium text-base transition-all duration-300 shrink-0 mt-4 ${
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
