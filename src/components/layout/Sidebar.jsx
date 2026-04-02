import { AnimatePresence, motion } from "framer-motion";
import { Command, PanelLeftClose, Sparkles } from "lucide-react";
import { useAppState } from "../../context/AppStateContext";

function Sidebar({ activeSection, isOpen, items, onClose, onNavigate }) {
  const { demoMode, selectedEnvironment } = useAppState();

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          type="button"
        />
      ) : null}

      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-[19.5rem] border-r border-white/10 bg-[linear-gradient(180deg,rgba(5,10,20,0.96),rgba(5,9,17,0.88))] px-4 py-5 shadow-[0_24px_100px_rgba(0,0,0,0.42)] backdrop-blur-2xl transition-transform duration-300 lg:z-30 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        initial={false}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-3">
            <button
              className="flex items-center gap-3 text-left"
              onClick={() => onNavigate("overview")}
              type="button"
            >
              <div className="rounded-[1.2rem] border border-sky-300/18 bg-sky-300/12 p-3 shadow-glow">
                <Command className="h-5 w-5 text-sky-100" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-slate-50">CIS Hackathon</p>
                <p className="surface-label mt-1">Developer Command Center</p>
              </div>
            </button>

            <button
              className="rounded-full border border-white/10 bg-white/[0.06] p-2 text-slate-300 transition hover:border-sky-300/20 hover:text-white lg:hidden"
              onClick={onClose}
              type="button"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 glass-subpanel px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-100">Launch workspace</p>
                <p className="mt-1 text-xs text-slate-400">
                  Dense, demo-first tooling for API replay and diagnosis.
                </p>
              </div>
              <span className={demoMode ? "badge-good" : "badge-neutral"}>
                <span className={`status-dot ${demoMode ? "bg-emerald-300" : "bg-slate-400"}`} />
                {demoMode ? "Demo live" : "Demo paused"}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>{selectedEnvironment}</span>
              <span>Judge deck armed</span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {items.map(({ description, icon: Icon, id, label }) => {
              const isActive = activeSection === id;

              return (
                <motion.button
                  key={id}
                  className={`group flex w-full items-center gap-3 rounded-[1.35rem] border px-3 py-3 text-left transition ${
                    isActive
                      ? "border-sky-300/22 bg-sky-300/12 shadow-glow"
                      : "border-transparent bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.06]"
                  }`}
                  onClick={() => onNavigate(id)}
                  type="button"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div
                    className={`rounded-[1rem] border p-2.5 ${
                      isActive
                        ? "border-sky-300/20 bg-sky-300/12 text-sky-100"
                        : "border-white/10 bg-white/[0.05] text-slate-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-100">{label}</p>
                      {isActive ? <span className="status-dot bg-sky-300" /> : null}
                    </div>
                    <p className="mt-1 text-xs text-slate-400 transition group-hover:text-slate-300">
                      {description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-auto glass-card relative overflow-hidden px-4 py-4">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
            <div className="flex items-start gap-3">
              <div className="rounded-[1rem] border border-emerald-300/18 bg-emerald-300/12 p-2.5 text-emerald-100">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="font-display text-base font-semibold text-slate-50">Finalist mode</p>
                <p className="mt-1 text-sm leading-6 text-slate-300/74">
                  The shell is tuned to tell a product story: launch a probe, surface the anomaly,
                  and close with clear operator intelligence.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="glass-subpanel px-3 py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Workspace health</span>
                  <span className="text-emerald-300">99.98%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/[0.06]">
                  <div className="h-2 w-[86%] rounded-full bg-gradient-to-r from-sky-300 to-emerald-300" />
                </div>
              </div>

              <div className="glass-subpanel px-3 py-3 text-sm text-slate-300">
                <p className="font-medium text-slate-100">Pitch cue</p>
                <p className="mt-2 leading-6 text-slate-400">
                  "CIS Hackathon turns every API call into a live, observable product workflow."
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

export default Sidebar;
