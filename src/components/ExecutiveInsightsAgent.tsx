"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Brain, Sparkles, TrendingUp, ShieldAlert } from "lucide-react";

export function ExecutiveInsightsAgent() {
  const [summary, setSummary] = useState({
    totalLeads: 0,
    hotLeads: 0,
    totalCustomers: 0,
    openRisks: 0,
    totalRiskImpact: 0,
  });

  useEffect(() => {
    async function fetchExecutiveData() {
      const { data: leads } = await supabase.from("leads").select("*");
      const { data: customers } = await supabase.from("customers").select("*");
      const { data: risks } = await supabase.from("revenue_risks").select("*");

      setSummary({
        totalLeads: leads?.length || 0,
        hotLeads: leads?.filter((lead) => lead.status === "hot").length || 0,
        totalCustomers: customers?.length || 0,
        openRisks: risks?.filter((risk) => risk.status === "open").length || 0,
        totalRiskImpact:
          risks?.reduce(
            (sum, risk) => sum + Number(risk.impact_mrr || 0),
            0,
          ) || 0,
      });
    }

    fetchExecutiveData();
  }, []);

  return (
    <section className="mb-10 rounded-[1.75rem] border border-white/[0.06] bg-white/[0.025] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-fuchsia-500/20">
          <Brain className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Executive Insights Agent
          </h2>
          <p className="text-sm text-zinc-500">
            AI-generated business summary from live Supabase data
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
          <Sparkles className="mb-3 h-5 w-5 text-violet-300" />
          <p className="text-xs uppercase tracking-wider text-zinc-600">
            Total Leads
          </p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {summary.totalLeads}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
          <TrendingUp className="mb-3 h-5 w-5 text-emerald-300" />
          <p className="text-xs uppercase tracking-wider text-zinc-600">
            Hot Leads
          </p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {summary.hotLeads}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
          <Brain className="mb-3 h-5 w-5 text-sky-300" />
          <p className="text-xs uppercase tracking-wider text-zinc-600">
            Customers
          </p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {summary.totalCustomers}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
          <ShieldAlert className="mb-3 h-5 w-5 text-amber-300" />
          <p className="text-xs uppercase tracking-wider text-zinc-600">
            Risk Impact
          </p>
          <p className="mt-1 text-2xl font-semibold text-white">
            ${summary.totalRiskImpact.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
        <p className="text-sm leading-relaxed text-zinc-200">
  {summary.hotLeads} high-intent leads are currently active. Revenue
  exposure is ${summary.totalRiskImpact.toLocaleString()} across{" "}
  {summary.openRisks} customer accounts. Immediate focus should be
  placed on recovering at-risk accounts while prioritizing enterprise
  opportunities with scores above 80.
</p>
      </div>
    </section>
  );
}