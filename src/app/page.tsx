"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { ProgressBar } from "@/components/ProgressBar";
import { StepWelcome } from "@/components/StepWelcome";
import { StepAccountType } from "@/components/StepAccountType";
import { StepAnnualIncome } from "@/components/StepAnnualIncome";
import { StepGoals } from "@/components/StepGoals";
import { StepSuccess } from "@/components/StepSuccess";
import { CriterionLogo } from "@/components/CriterionLogo";
import { Disclaimer } from "@/components/Disclaimer";

const StepIntro = dynamic(() => import("@/components/StepIntro").then((m) => ({ default: m.StepIntro })), {
  loading: () => <div className="flex-1 flex items-center justify-center min-h-screen" />,
});

const StepCardCustomization = dynamic(
  () => import("@/components/StepCardCustomization").then((m) => ({ default: m.StepCardCustomization })),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center min-h-[500px]" /> }
);

const STEP_LABELS = ["Details", "Priorities", "Account", "Income", "Card", "Done"];

const TOTAL_STEPS = 7; // Intro + 6 form steps

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);

  const [personalData, setPersonalData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cpf: "",
    birthDate: "",
  });

  const [accountData, setAccountData] = useState({
    accountType: "",
    annualIncome: "",
  });

  const [goalsData, setGoalsData] = useState({
    priorities: [] as string[],
  });

  const [cardData, setCardData] = useState({
    cardSkin: "dark",
    cardName: "",
  });

  const handlePersonalChange = (field: string, value: string) => {
    setPersonalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAccountChange = (field: string, value: string) => {
    setAccountData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGoalsChange = (field: string, value: string[]) => {
    setGoalsData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCardChange = (field: string, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  const goBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const goToStep = (progressIndex: number) => {
    setCurrentStep(progressIndex + 1);
  };

  const formProgressIndex = currentStep - 1;

  return (
    <div className="min-h-screen flex flex-col bg-criterion-dark relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full opacity-[0.02]"
          style={{
            background: "radial-gradient(circle, #64E1FB 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-[30%] -left-[20%] w-[60%] h-[60%] rounded-full opacity-[0.02]"
          style={{
            background: "radial-gradient(circle, #C1D463 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Header — hidden on intro, card step, and success */}
      {currentStep !== 0 && currentStep !== 5 && currentStep !== 6 && (
        <header className="relative z-10 px-6 lg:px-12 py-6 flex items-center justify-between">
          <CriterionLogo className="h-6 w-auto" />
          {currentStep < 6 && (
            <div className="hidden md:block text-xs text-white/30">
              Step {currentStep} of {STEP_LABELS.length}
            </div>
          )}
        </header>
      )}

      {/* Progress — hidden on intro (0) and success (6); card step (5) renders it inside */}
      {currentStep >= 1 && currentStep <= 4 && (
        <div className="relative z-10 px-6 lg:px-12 mb-8">
          <ProgressBar
            currentStep={formProgressIndex}
            totalSteps={STEP_LABELS.length}
            labels={STEP_LABELS}
            onStepClick={goToStep}
          />
        </div>
      )}

      {/* Content */}
      <main
        className={`relative z-10 flex flex-1 flex-col min-h-0 ${currentStep === 0 ? "h-screen overflow-hidden" : ""} ${currentStep === 5 ? "" : currentStep !== 0 ? "px-6 lg:px-12 pb-12" : ""}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className={
              currentStep === 0
                ? "flex-1 flex flex-col min-h-0 overflow-hidden"
                : currentStep === 6
                  ? "flex-1 flex items-center justify-center"
                  : ""
            }
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {currentStep === 0 && <StepIntro onNext={goNext} />}
            {currentStep === 1 && (
              <StepWelcome
                data={personalData}
                onChange={handlePersonalChange}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {currentStep === 2 && (
              <StepGoals
                data={goalsData}
                onChange={handleGoalsChange}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {currentStep === 3 && (
              <StepAccountType
                data={accountData}
                onChange={handleAccountChange}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {currentStep === 4 && (
              <StepAnnualIncome
                data={accountData}
                onChange={handleAccountChange}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {currentStep === 5 && (
              <StepCardCustomization
                data={cardData}
                personalName={personalData.fullName}
                onChange={handleCardChange}
                onNext={goNext}
                onBack={goBack}
                currentStep={formProgressIndex}
                totalSteps={STEP_LABELS.length}
                stepLabels={STEP_LABELS}
              />
            )}
            {currentStep === 6 && (
              <StepSuccess
                personalName={personalData.fullName}
                accountType={accountData.accountType}
              />
            )}
          </motion.div>
        </AnimatePresence>
        {/* Disclaimer — only on initial (0) and final (6) screens */}
        {(currentStep === 0 || currentStep === 6) && (
          <div className={`shrink-0 max-w-6xl mx-auto w-full ${currentStep === 0 ? "py-3 px-16 sm:px-20 lg:px-12" : "pt-6 pb-6 px-6 lg:px-12"}`}>
            <Disclaimer />
          </div>
        )}
      </main>
    </div>
  );
}
