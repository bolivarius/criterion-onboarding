"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CriterionLogo, CriterionSymbol } from "./CriterionLogo";

interface StepIntroProps {
  onNext: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
};

export function StepIntro({ onNext }: StepIntroProps) {
  return (
    <motion.div
      className="relative flex flex-col flex-1 min-h-0 overflow-hidden"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Top section: Logo, headline, description — mobile-first stacking */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 sm:gap-3 lg:gap-4 px-16 sm:px-20 lg:px-40 pt-6 sm:pt-8 lg:pt-12 pb-1 sm:pb-2 lg:pb-3 shrink-0">
        <div className="flex-1 min-w-0">
          <motion.div className="mb-3 sm:mb-4" variants={item}>
            <CriterionLogo className="h-6 sm:h-7 w-auto" color="white" />
          </motion.div>
          <motion.h1
            className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight text-white font-normal"
            style={{ fontFamily: "var(--font-freeman), serif" }}
            variants={item}
          >
            Your new financial
            <br />
            life awaits.
          </motion.h1>
        </div>
        <div className="flex flex-col items-start gap-[26px] lg:max-w-[437px] shrink-0 w-full lg:w-auto">
          <motion.div className="flex justify-start" variants={item}>
            <CriterionSymbol className="h-8 sm:h-10 w-auto" color="blue" />
          </motion.div>
          <motion.p
            className="text-white text-base sm:text-lg lg:text-xl leading-relaxed font-light text-left"
            variants={item}
          >
            Let&apos;s start your journey with Criterion. In just a few minutes you&apos;ll
            have access to banking that truly understands your needs.
          </motion.p>
        </div>
      </div>

      {/* Hero image — mobile uses heroimg-mobile, desktop uses heroimg3 */}
      <div className="relative flex-1 flex items-center justify-center min-h-[320px] px-16 sm:px-20 lg:px-40 pb-2 sm:pb-3 lg:pb-4 pt-1 sm:pt-2 lg:pt-3 overflow-hidden">
        <motion.div
          className="relative w-full h-full min-h-[280px] rounded-2xl sm:rounded-3xl overflow-hidden md:hidden flex-1"
          variants={item}
        >
          <Image
            src="/heroimg-mobile.png"
            alt="Welcome to Criterion"
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
          {/* CTA button — overlaid on image, touch-friendly on mobile */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <motion.button
              onClick={onNext}
              className="flex items-center justify-center gap-2 px-8 py-6 rounded-xl font-semibold text-xl bg-criterion-blue text-criterion-dark hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 min-h-[67px]"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(100, 225, 251, 0.4)",
                  "0 0 35px rgba(100, 225, 251, 0.6)",
                  "0 0 20px rgba(100, 225, 251, 0.4)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileTap={{ scale: 0.98 }}
            >
              Let&apos;s Begin
              <ArrowRight size={31} />
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          className="relative w-full h-full min-h-[280px] rounded-3xl overflow-hidden hidden md:flex isolate flex-1"
          variants={item}
        >
          <Image
            src="/heroimg3.png"
            alt="Welcome to Criterion"
            fill
            className="object-contain object-center"
            sizes="100vw"
            priority
          />
          {/* CTA button — inside image, top-right aligned */}
          <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-10">
            <motion.button
              onClick={onNext}
              className="flex items-center justify-center gap-2 px-14 py-7 rounded-2xl font-semibold text-2xl bg-criterion-blue text-criterion-dark hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 shadow-lg shadow-black/25"
              animate={{
                boxShadow: [
                  "0 4px 24px rgba(0,0,0,0.25), 0 0 20px rgba(100, 225, 251, 0.4)",
                  "0 8px 32px rgba(0,0,0,0.3), 0 0 35px rgba(100, 225, 251, 0.6)",
                  "0 4px 24px rgba(0,0,0,0.25), 0 0 20px rgba(100, 225, 251, 0.4)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileTap={{ scale: 0.98 }}
            >
              Let&apos;s Begin
              <ArrowRight size={31} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
