import { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  description,
  children,
  tone = "white",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  tone?: "white" | "soft";
}) {
  return (
    <section className={tone === "soft" ? "bg-slate-50" : "bg-white"}>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="mb-9 max-w-3xl">
          {eyebrow ? (
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0f766e]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h2>
          {description ? <p className="mt-4 text-base leading-7 text-slate-600">{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
