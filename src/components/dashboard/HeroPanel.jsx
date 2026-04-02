import { motion } from "framer-motion";
import { ArrowRight, Play, ShieldCheck } from "lucide-react";
import { dashboardHighlights, statusBadges } from "../../data/dashboardData";

const toneClasses = {
  amber: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  cyan: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
  emerald: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
};

function HeroPanel({ onNavigate }) {
  return (
    <section className="section-shell relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(103,232,249,0.18),transparent_28%),radial-gradient(circle_at_0%_100%,rgba(16,185,129,0.14),transparent_26%)]" />
      <div className="absolute right-[-12%] top-[-8%] hidden h-72 w-72 rounded-full bg-cyan-400/18 blur-3xl lg:block" />

      <div className="relative grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
        <div>
          <p className="eyebrow">Premium API intelligence</p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl xl:text-[4.1rem]">
            CIS Hackathon gives every API call a <span className="text-gradient">control room</span>.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300/78 sm:text-lg">
            An AI-powered Postman, debugger, and monitoring dashboard for teams that need fast
            feedback, clean traces, and a demo-worthy interface without sacrificing signal.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {statusBadges.map(({ icon: Icon, label, tone, value }) => (
              <div
                key={label}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm ${toneClasses[tone]}`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
                <span className="text-slate-50/80">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              className="inline-flex items-center rounded-full border border-cyan-300/22 bg-cyan-300/12 px-5 py-3 text-sm font-semibold text-cyan-50 transition hover:border-cyan-200/40 hover:bg-cyan-300/18"
              onClick={() => onNavigate("api-tester")}
              type="button"
            >
              <Play className="mr-2 h-4 w-4" />
              Launch live console
            </button>
            <button
              className="inline-flex items-center rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-white/16 hover:bg-white/[0.08]"
              onClick={() => onNavigate("request-history")}
              type="button"
            >
              Explore traces
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>

        <motion.div
          className="glass-card relative overflow-hidden p-5"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35 }}
        >
          <div className="absolute inset-0 bg-hero-grid bg-[length:54px_54px] opacity-[0.08]" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300/82">Demo-ready control room</p>
                <p className="mt-1 font-display text-2xl font-semibold text-slate-50">
                  Launch strong in under 30 seconds
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-300/16 bg-cyan-300/10 p-3 text-cyan-100">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {dashboardHighlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="rounded-2xl border border-white/8 bg-white/[0.04] p-4"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.25, delay: index * 0.08 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" />
                    <div>
                      <p className="font-medium text-slate-50">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-300/72">{item.detail}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroPanel;
