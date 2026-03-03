"use client";

import { motion } from "framer-motion";
import { Upload, Camera, FileText, Shield, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface StepDocumentsProps {
  data: {
    documentType: string;
    documentFront: boolean;
    documentBack: boolean;
    selfie: boolean;
  };
  onChange: (field: string, value: string | boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

export function StepDocuments({ data, onChange, onNext, onBack }: StepDocumentsProps) {
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const simulateUpload = (field: string) => {
    setUploadingField(field);
    setTimeout(() => {
      onChange(field, true);
      setUploadingField(null);
    }, 1500);
  };

  const isValid = data.documentType && data.documentFront && data.documentBack && data.selfie;

  const docTypes = [
    { id: "id", label: "ID Card" },
    { id: "license", label: "Driver License" },
    { id: "passport", label: "Passport" },
  ];

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
          className="text-3xl lg:text-5xl mb-4"
          style={{ fontFamily: "var(--font-freeman), serif" }}
        >
          Identity <span className="text-criterion-green-lite">verification</span>
        </h1>
        <p className="text-white/50 text-lg font-light">
          We need to verify your identity for your security.
        </p>
      </motion.div>

      {/* Security badge */}
      <motion.div
        className="flex items-center gap-3 bg-criterion-blue/5 border border-criterion-blue/10 rounded-2xl p-4 mb-10"
        variants={item}
      >
        <Shield size={20} className="text-criterion-blue flex-shrink-0" />
        <p className="text-sm text-white/60">
          Your data is protected with end-to-end encryption.
          We comply with all banking regulatory standards.
        </p>
      </motion.div>

      {/* Document type selection */}
      <motion.div className="mb-8" variants={item}>
        <label className="block text-xs text-white/50 mb-3 uppercase tracking-wider">
          Document type
        </label>
        <div className="flex gap-3">
          {docTypes.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onChange("documentType", doc.id)}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                data.documentType === doc.id
                  ? "bg-criterion-blue text-criterion-dark"
                  : "bg-white/5 text-white/50 hover:bg-white/10 border border-white/[0.06]"
              }`}
            >
              {doc.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Upload areas */}
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {/* Document Front */}
        <motion.div variants={item}>
          <UploadCard
            label="Document front"
            icon={<FileText size={28} />}
            isUploaded={data.documentFront}
            isUploading={uploadingField === "documentFront"}
            onUpload={() => simulateUpload("documentFront")}
          />
        </motion.div>

        {/* Document Back */}
        <motion.div variants={item}>
          <UploadCard
            label="Document back"
            icon={<FileText size={28} />}
            isUploaded={data.documentBack}
            isUploading={uploadingField === "documentBack"}
            onUpload={() => simulateUpload("documentBack")}
          />
        </motion.div>

        {/* Selfie */}
        <motion.div variants={item}>
          <UploadCard
            label="Selfie with document"
            icon={<Camera size={28} />}
            isUploaded={data.selfie}
            isUploading={uploadingField === "selfie"}
            onUpload={() => simulateUpload("selfie")}
          />
        </motion.div>
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

function UploadCard({
  label,
  icon,
  isUploaded,
  isUploading,
  onUpload,
}: {
  label: string;
  icon: React.ReactNode;
  isUploaded: boolean;
  isUploading: boolean;
  onUpload: () => void;
}) {
  return (
    <button
      onClick={onUpload}
      disabled={isUploaded || isUploading}
      className={`w-full aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-500 ${
        isUploaded
          ? "border-criterion-green-lite/30 bg-criterion-green-lite/5"
          : isUploading
          ? "border-criterion-blue/30 bg-criterion-blue/5"
          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
      }`}
    >
      {isUploaded ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <CheckCircle2 size={32} className="text-criterion-green-lite" />
        </motion.div>
      ) : isUploading ? (
        <motion.div
          className="w-8 h-8 border-2 border-criterion-blue/30 border-t-criterion-blue rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <div className="text-white/30">
          {icon}
        </div>
      )}
      <span className={`text-xs text-center px-2 ${isUploaded ? "text-criterion-green-lite" : "text-white/40"}`}>
        {isUploaded ? "Uploaded" : isUploading ? "Uploading..." : label}
      </span>
      {!isUploaded && !isUploading && (
        <Upload size={14} className="text-white/20" />
      )}
    </button>
  );
}
