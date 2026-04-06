"use client";

import { Layout } from "lucide-react";

export function TemplateSelector() {

  return (
    <div className="rounded-sm border border-white/5 bg-ink-surface-1 overflow-hidden">
      <div className="h-32 w-full bg-black flex items-center justify-center border-b border-white/5">
        <Layout className="text-white/20 w-10 h-10" />
      </div>
      <div className="p-5 space-y-2">
        <h3 className="text-sm font-bold text-ink-primary uppercase tracking-widest">Standard</h3>
        <p className="text-[11px] text-ink-secondary leading-relaxed uppercase tracking-wider">
          Launch profiles use the standard public template. Template switching is not part of the canonical remote schema.
        </p>
      </div>
    </div>
  );
}
