import { motion } from "framer-motion";
import { Activity, ArrowUpRight } from "lucide-react";
import { activityFeed, serviceHealth } from "../../data/dashboardData";

function SystemHealthPanel() {
  return (
    <div className="glass-card hover-lift p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Live operations</p>
          <h3 className="font-display text-2xl font-semibold text-slate-50">System health snapshot</h3>
        </div>
        <div className="rounded-2xl border border-emerald-300/16 bg-emerald-300/10 p-3 text-emerald-100">
          <Activity className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <div className="grid gap-3">
          {serviceHealth.map((service, index) => (
            <motion.div
              key={service.name}
              className="rounded-3xl border border-white/8 bg-slate-950/35 p-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.05, duration: 0.25 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-50">{service.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{service.status}</p>
                </div>
                <div className="rounded-full border border-emerald-300/16 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100">
                  {service.uptime}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-300/74">
                <span>Observed latency</span>
                <span>{service.latency}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-3xl border border-white/8 bg-slate-950/35 p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-slate-50">Recent activity</p>
            <ArrowUpRight className="h-4 w-4 text-cyan-200" />
          </div>

          <div className="mt-5 space-y-4">
            {activityFeed.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-50">{item.title}</p>
                      <span className="text-xs text-slate-500">{item.time}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300/74">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemHealthPanel;
