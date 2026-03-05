"use client";

import { motion } from "framer-motion";
import { CriterionLogo, CriterionSymbol } from "./CriterionLogo";
import { Share2, ArrowLeft, CheckCircle2 } from "lucide-react";

interface StepSuccessProps {
  personalName: string;
  accountType: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

const TIMELINE_STEPS = [
  { id: "waitlist", label: "Join the waitlist", status: "done" as const },
  { id: "approved", label: "Get approved", status: "current" as const },
  { id: "receive", label: "Receive your access and card", status: "pending" as const },
  { id: "start", label: "Start using Criterion", status: "pending" as const, date: "AUG 26" },
];

export function StepSuccess({ personalName, accountType: _accountType }: StepSuccessProps) {
  const firstName = personalName.split(" ")[0] || "there";

  return (
    <motion.div
      className="max-w-3xl mx-auto text-center flex flex-col items-center"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Criterion logo — above title, centered */}
      <motion.div className="mb-8" variants={item}>
        <CriterionLogo className="mx-auto h-8 w-auto" color="white" />
      </motion.div>

      {/* Title */}
      <motion.h1
        className="text-4xl lg:text-6xl mb-6"
        style={{ fontFamily: "var(--font-freeman), serif" }}
        variants={item}
      >
        Congratulations <span className="text-criterion-blue">{firstName}</span>, you&apos;re in.
      </motion.h1>

      <motion.p
        className="text-xl text-white/50 font-light mb-10 max-w-lg mx-auto"
        variants={item}
      >
        You have successfully joined the waitlist. We&apos;ll notify you when we&apos;re ready.
      </motion.p>

      {/* Connected timeline — 4 steps with dots and lines */}
      <motion.div className="w-full max-w-2xl mb-10 px-2" variants={item}>
        <div className="flex items-start">
          {TIMELINE_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Dot */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative">
                  {step.status === "done" ? (
                    <div className="w-8 h-8 rounded-full bg-criterion-green-lite flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-criterion-dark" strokeWidth={2.5} />
                    </div>
                  ) : step.status === "current" ? (
                    <>
                      <div className="w-8 h-8 rounded-full border-2 border-criterion-blue bg-criterion-dark flex items-center justify-center relative">
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-criterion-blue"
                          animate={{ scale: [1, 1.8, 1.8], opacity: [0.6, 0, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                        />
                        <div className="w-2 h-2 rounded-full bg-criterion-blue" />
                      </div>
                    </>
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-criterion-dark" />
                  )}
                </div>
                {/* Label below dot */}
                <div className="mt-3 text-center max-w-[100px] mx-auto">
                  <p
                    className={`text-[11px] lg:text-xs font-medium leading-tight ${
                      step.status === "done"
                        ? "text-criterion-green-lite"
                        : step.status === "current"
                        ? "text-criterion-blue"
                        : "text-white/40"
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.date && (
                    <p className="text-criterion-blue font-medium text-xs mt-0.5">{step.date}</p>
                  )}
                </div>
              </div>
              {/* Connecting line to next */}
              {index < TIMELINE_STEPS.length - 1 && (
                <div
                  className="flex-1 h-[2px] mx-1 mt-4 min-w-[12px]"
                  style={{
                    background: step.status === "done"
                      ? "linear-gradient(90deg, #C1D463, rgba(255,255,255,0.15))"
                      : "rgba(255,255,255,0.15)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto mb-10" variants={item}>
        <motion.button
          className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-criterion-blue text-criterion-dark font-medium hover:shadow-lg hover:shadow-criterion-blue/20 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Share2 size={18} />
          Share this
        </motion.button>
        <motion.button
          className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border border-white/10 text-white/70 hover:bg-white/5 font-medium transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft size={18} />
          Back to Website
        </motion.button>
      </motion.div>

      {/* Footer — symbol only */}
      <motion.div className="pt-10" variants={item}>
        <CriterionSymbol className="mx-auto opacity-40 h-5 w-auto" color="white" />
      </motion.div>
    </motion.div>
  );
}
