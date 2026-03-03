export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`text-[10px] sm:text-xs text-white/25 text-center max-w-2xl mx-auto leading-relaxed ${className}`}
    >
      Criterion is not a bank. Criterion is a financial technology company. Banking
      services provided by Mbanq&apos;s Bank partners.
    </p>
  );
}
