import { motion } from "framer-motion";
import { BellRing, Command, Menu, RadioTower, Search, Sparkles } from "lucide-react";
import { useAppState } from "../../context/AppStateContext";

function Topbar({ onMenuToggle, onNavigate }) {
  const { demoMode, searchQuery, selectedEnvironment, setSearchQuery, toggleDemoMode } = useAppState();

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-20 border-b border-white/10 bg-[linear-gradient(180deg,rgba(4,9,18,0.94),rgba(4,9,18,0.72))] backdrop-blur-2xl lg:left-[19.5rem]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
        <button
          className="rounded-full border border-white/10 bg-white/[0.06] p-2 text-slate-200 transition hover:border-sky-300/20 hover:text-white lg:hidden"
          onClick={onMenuToggle}
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-sky-300/20 hover:bg-white/[0.08] lg:inline-flex"
          onClick={() => onNavigate("overview")}
          type="button"
        >
          <Command className="h-4 w-4 text-sky-200" />
          CIS Hackathon
        </button>

        <label className="group relative flex min-w-0 flex-1 items-center xl:max-w-xl">
          <Search className="pointer-events-none absolute left-4 h-4 w-4 text-slate-500 transition group-focus-within:text-sky-200" />
          <input
            className="input-shell h-11 w-full rounded-full pl-11 pr-24"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search traces, collections, alerts, and diagnostics"
            type="search"
            value={searchQuery}
          />
          <span className="pointer-events-none absolute right-3 hidden rounded-full border border-white/10 bg-slate-950/50 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400 md:inline-flex">
            Ctrl K
          </span>
        </label>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-slate-200 xl:inline-flex">
          <RadioTower className="h-4 w-4 text-emerald-200" />
          {selectedEnvironment}
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-emerald-300/18 bg-emerald-300/12 px-3 py-2 text-sm text-emerald-100 md:inline-flex">
          <span className="status-dot animate-pulse bg-emerald-300" />
          Live telemetry
        </div>

        <button
          className={`relative inline-flex h-11 items-center rounded-full border px-3 py-2 text-sm font-medium transition ${
            demoMode
              ? "border-sky-300/22 bg-sky-300/14 text-sky-50"
              : "border-white/10 bg-white/[0.05] text-slate-200"
          }`}
          onClick={toggleDemoMode}
          type="button"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Demo mode
          <span className="ml-3 flex h-5 w-10 items-center rounded-full bg-slate-950/60 px-1">
            <motion.span
              animate={{ x: demoMode ? 18 : 0 }}
              className={`h-3.5 w-3.5 rounded-full ${demoMode ? "bg-sky-300" : "bg-slate-500"}`}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
            />
          </span>
        </button>

        <button
          className="rounded-full border border-white/10 bg-white/[0.05] p-2 text-slate-200 transition hover:border-sky-300/20 hover:text-white"
          type="button"
        >
          <BellRing className="h-4 w-4" />
        </button>
      </div>
    </motion.header>
  );
}

export default Topbar;
