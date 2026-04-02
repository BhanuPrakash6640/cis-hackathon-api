import { motion } from "framer-motion";

const accentStyles = {
  amber: "from-amber-400/20 via-amber-300/8 to-transparent text-amber-200",
  cyan: "from-cyan-400/20 via-cyan-300/8 to-transparent text-cyan-200",
  emerald: "from-emerald-400/20 via-emerald-300/8 to-transparent text-emerald-200",
  sky: "from-sky-400/20 via-sky-300/8 to-transparent text-sky-200",
};

function StatCard({ accent = "cyan", change, footnote, icon: Icon, label, value }) {
  return (
    <motion.article
      className="glass-card hover-lift relative overflow-hidden px-5 py-5"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35 }}
    >
      <div
        className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${accentStyles[accent]} opacity-80`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-300/82">{label}</p>
          <p className="mt-3 font-display text-3xl font-semibold text-slate-50">{value}</p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/6 p-3 shadow-inner shadow-cyan-500/10">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-3 text-sm">
        <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-slate-200/88">
          {change}
        </span>
        <span className="text-right text-slate-400">{footnote}</span>
      </div>
    </motion.article>
  );
}

export default StatCard;
