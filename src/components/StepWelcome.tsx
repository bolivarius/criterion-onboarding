"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface StepWelcomeProps {
  data: {
    fullName: string;
    email: string;
    phone: string;
    cpf: string;
    birthDate: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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

export function StepWelcome({ data, onChange, onNext, onBack }: StepWelcomeProps) {
  const isValid = data.fullName && data.email && data.phone && data.cpf && data.birthDate;

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

      <motion.div className="mb-8" variants={item}>
        <h1
          className="text-3xl lg:text-5xl mb-4 text-white"
          style={{ fontFamily: "var(--font-freeman), serif" }}
        >
          Tell us a bit about you
        </h1>
        <p className="text-white/50 text-lg font-light">
          Enter your information to get started.
        </p>
      </motion.div>

      {/* Form - horizontally responsive */}
      <motion.div
        className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-6 sm:p-8 lg:p-10"
        variants={item}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          <motion.div className="sm:col-span-2" variants={item}>
            <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">
              Full name
            </label>
            <input
              type="text"
              placeholder="Your full name"
              value={data.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
            />
          </motion.div>

          <motion.div variants={item}>
            <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">
              Date of birth
            </label>
            <input
              type="date"
              value={data.birthDate}
              onChange={(e) => onChange("birthDate", e.target.value)}
            />
          </motion.div>

          <motion.div className="sm:col-span-2" variants={item}>
            <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              placeholder="you@email.com"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
          </motion.div>

          <motion.div variants={item}>
            <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">
              Tax ID
            </label>
            <input
              type="text"
              placeholder="000-00-0000"
              value={data.cpf}
              onChange={(e) => onChange("cpf", e.target.value)}
            />
          </motion.div>

          <motion.div className="sm:col-span-2 lg:col-span-3" variants={item}>
            <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">
              Phone
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={data.phone}
              onChange={(e) => onChange("phone", e.target.value)}
            />
          </motion.div>
        </div>

        <motion.button
          onClick={onNext}
          disabled={!isValid}
          className={`w-full sm:w-auto sm:min-w-[200px] mt-8 py-4 rounded-2xl font-medium text-base transition-all duration-300 ${
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
    </motion.div>
  );
}
