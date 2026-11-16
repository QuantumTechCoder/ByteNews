export const runtime = "edge";

export default function LegalPage() {
  return (
    <div className="py-6 max-w-2xl mx-auto space-y-4 font-sans text-xs sm:text-[13px] leading-relaxed text-neutral-800 dark:text-neutral-200">
      <h1 className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        ByteNews Legal &amp; Privacy
      </h1>

      <p>
        ByteNews respects developer privacy. We collect minimal telemetry and zero tracking cookies.
      </p>

      <p>
        All submitted content remains the intellectual property of its respective authors. Content is distributed under standard fair use and community attribution norms.
      </p>
    </div>
  );
}
