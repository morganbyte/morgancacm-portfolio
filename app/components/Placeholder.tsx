// Marks content that still has to be written. Visible only in `npm run dev`;
// production renders nothing, so a half-filled section never ships broken.
export const isDev = process.env.NODE_ENV !== "production";

export default function Placeholder({ children }: { children: React.ReactNode }) {
  if (!isDev) return null;
  return (
    <div className="rounded-lg border border-dashed border-amber-500/40 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/80">
      <span className="mr-2 font-mono text-[11px] uppercase tracking-wider text-amber-400">
        TODO
      </span>
      {children}
    </div>
  );
}
