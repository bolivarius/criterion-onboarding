"use client";

import { motion } from "framer-motion";
import { CriterionLogo, CriterionSymbol } from "./CriterionLogo";
import { Share2, ArrowLeft } from "lucide-react";

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
      <motion.div className="mb-6" variants={item}>
        <CriterionLogo className="mx-auto h-8 w-auto" color="white" />
      </motion.div>

      {/* Title */}
      <motion.h1
        className="text-4xl lg:text-6xl mb-4"
        style={{ fontFamily: "var(--font-freeman), serif" }}
        variants={item}
      >
        Congratulations <span className="text-criterion-blue">{firstName}</span>, you&apos;re in.
      </motion.h1>

      <motion.p
        className="text-xl text-white/50 font-light mb-6 max-w-lg mx-auto"
        variants={item}
      >
        You have successfully joined the waitlist. We&apos;ll notify you when we&apos;re ready.
      </motion.p>

      {/* Launch time box */}
      <motion.div
        className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl px-8 py-4 mb-6 inline-block"
        variants={item}
      >
        <span className="text-white/70 text-lg">Launch time: </span>
        <span className="text-criterion-blue font-medium text-lg">AUG 26</span>
      </motion.div>

      {/* Action buttons */}
      <motion.div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto mb-6" variants={item}>
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
      <motion.div className="pt-6" variants={item}>
        <CriterionSymbol className="mx-auto opacity-40 h-5 w-auto" color="white" />
      </motion.div>
    </motion.div>
  );
}
