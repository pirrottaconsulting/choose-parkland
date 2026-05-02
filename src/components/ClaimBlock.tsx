import { getClaim } from "@/lib/site";
import { SourceNote } from "./SourceNote";

export function ClaimBlock({ claimId }: { claimId: string }) {
  const claim = getClaim(claimId);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f766e]">
        Source-connected note
      </p>
      <p className="mt-2 text-base leading-7 text-slate-700">{claim.text}</p>
      <SourceNote sourceIds={claim.sourceIds} />
    </div>
  );
}
