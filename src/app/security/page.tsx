export const runtime = "edge";

export default function SecurityPage() {
  return (
    <div className="py-6 max-w-2xl mx-auto space-y-4 font-sans text-xs sm:text-[13px] leading-relaxed text-neutral-800 dark:text-neutral-200">
      <h1 className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        ByteNews Security
      </h1>

      <p>
        Security is a core focus of ByteNews. We employ defense-in-depth engineering practices:
      </p>

      <ul className="list-disc list-inside space-y-2 font-mono text-xs">
        <li>HTTP-only signed session tokens with SameSite=Lax protection.</li>
        <li>Bcrypt password hashing with salted rounds.</li>
        <li>Prepared statements via Prisma ORM preventing SQL injection.</li>
        <li>Input validation on all Server Action endpoints.</li>
        <li>Sanitized output rendering preventing Cross-Site Scripting (XSS).</li>
      </ul>
    </div>
  );
}
