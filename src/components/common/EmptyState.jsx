import { motion } from "framer-motion";

function EmptyState({ actionLabel, description, icon: Icon, onAction, title }) {
  return (
    <motion.div
      className="flex min-h-[240px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-8 text-center"
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-2xl border border-white/10 bg-white/6 p-4 shadow-glow">
        <Icon className="h-7 w-7 text-cyan-200" />
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-slate-50">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-300/72">{description}</p>
      {actionLabel ? (
        <button
          className="mt-5 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/40 hover:bg-cyan-300/16"
          onClick={onAction}
          type="button"
        >
          {actionLabel}
        </button>
      ) : null}
    </motion.div>
  );
}

export default EmptyState;
