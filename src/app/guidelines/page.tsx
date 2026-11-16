export const runtime = "edge";

export default function GuidelinesPage() {
  return (
    <div className="py-6 max-w-2xl mx-auto space-y-4 font-sans text-xs sm:text-[13px] leading-relaxed text-neutral-800 dark:text-neutral-200">
      <h1 className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        ByteNews Community Guidelines
      </h1>

      <section className="space-y-2">
        <h2 className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
          What to Submit
        </h2>
        <p>
          On-topic: Anything that good hackers would find interesting. That includes computer science, software engineering, AI/ML, security, hardware, open-source projects, and deep technical discussions.
        </p>
        <p>
          Off-topic: Most stories about politics, sensational news, generic product spam, or low-effort memes.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
          In Comments
        </h2>
        <p>
          Be respectful, curious, and thoughtful. Respond to arguments rather than attacking character. Avoid snark, flamewars, and low-substance quips. When disagreeing, point out where an assumption might break down with evidence or concrete experience.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
          Formatting Submissions
        </h2>
        <p>
          Please keep titles accurate and avoid clickbait. If you are showing your own work, prefix with &quot;Show BN:&quot;. If you are asking a thoughtful question, prefix with &quot;Ask BN:&quot;.
        </p>
      </section>
    </div>
  );
}
