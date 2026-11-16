import Link from "next/link";

export const runtime = "edge";

export default function NotFound() {
  return (
    <div className="py-16 text-center font-mono text-xs space-y-2">
      <p className="text-neutral-400">404 - Page Not Found</p>
      <Link href="/" className="text-[#FF6600] hover:underline">
        Return home
      </Link>
    </div>
  );
}
