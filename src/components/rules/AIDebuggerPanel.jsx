import { motion } from "framer-motion";
import { Bot, ShieldAlert } from "lucide-react";
import { useAppState } from "../../context/AppStateContext";

const severityToneClasses = {
  Action: "border-cyan-300/16 bg-cyan-300/10 text-cyan-100",
  High: "border-rose-300/16 bg-rose-300/10 text-rose-100",
  Info: "border-emerald-300/16 bg-emerald-300/10 text-emerald-100",
  Low: "border-sky-300/16 bg-sky-300/10 text-sky-100",
  Medium: "border-amber-300/16 bg-amber-300/10 text-amber-100",
  Standby: "border-slate-300/16 bg-slate-300/10 text-slate-100",
};

function AIDebuggerPanel() {
  const { debuggerInsights } = useAppState();

  return (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="glass-card overflow-hidden p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow">AI debugger</p>
            <h3 className="font-display text-2xl font-semibold text-slate-50">Guided failure analysis</h3>
          </div>
          <div className="rounded-2xl border border-cyan-300/16 bg-cyan-300/10 p-3 text-cyan-100">
            <Bot className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {debuggerInsights.map((insight, index) => (
            <motion.div
              key={insight.title}
              className="rounded-3xl border border-white/8 bg-slate-950/35 p-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.06, duration: 0.25 }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-medium text-slate-50">{insight.title}</p>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityToneClasses[insight.severity]}`}
                >
                  {insight.severity}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300/74">{insight.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-amber-300/16 bg-amber-300/10 p-3 text-amber-100">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-slate-50">Recommended demo flow</p>
            <p className="mt-1 text-sm text-slate-400">
              Show the platform’s wow factor with a short, realistic debugging narrative.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {[
            "Run a healthy request to establish a latency and payload baseline.",
            "Switch to an auth or failure preset to surface AI suggestions instantly.",
            "Jump to history and analytics to show how one request becomes an observability story.",
          ].map((step, index) => (
            <div key={step} className="rounded-3xl border border-white/8 bg-slate-950/35 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-300/18 bg-cyan-300/10 text-sm font-semibold text-cyan-100">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-slate-300/78">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIDebuggerPanel;
