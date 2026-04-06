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
        className={`fixed inset-y-0 left-0 z-50 w-[19.5rem] border-r border-slate-800 bg-slate-950 px-4 py-5 shadow-[0_18px_42px_rgba(15,23,42,0.2)] transition-transform duration-300 lg:z-30 lg:translate-x-0 ${
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
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.06] p-3">
                <Command className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-slate-50">CIS Hackathon</p>
                <p className="surface-label mt-1">API request workspace</p>
              </div>
            </button>

            <button
              className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition hover:border-white/20 hover:text-white lg:hidden"
              onClick={onClose}
              type="button"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
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
                      : "border-transparent bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]"
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
                        : "border-white/10 bg-white/[0.04] text-slate-300"
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

        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

export default Sidebar;
