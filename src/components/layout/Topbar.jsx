import { motion } from "framer-motion";
import { BellRing, Command, Menu, RadioTower, Search, Sparkles } from "lucide-react";
import { useAppState } from "../../context/AppStateContext";

function Topbar({ onMenuToggle, onNavigate }) {
  const { demoMode, searchQuery, selectedEnvironment, setSearchQuery, toggleDemoMode } = useAppState();

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-20 border-b border-slate-200 bg-stone-50/92 backdrop-blur-xl lg:left-[19.5rem]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
        <button
          className="rounded-full border border-slate-300 bg-white p-2 text-slate-700 transition hover:border-slate-400 hover:text-slate-950 lg:hidden"
          onClick={onMenuToggle}
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          className="hidden items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400 lg:inline-flex"
          onClick={() => onNavigate("overview")}
          type="button"
        >
          <Command className="h-4 w-4 text-sky-700" />
          CIS Hackathon
        </button>





        <button
          className="rounded-full border border-slate-300 bg-white p-2 text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          type="button"
        >
          <BellRing className="h-4 w-4" />
        </button>
      </div>
    </motion.header>
  );
}

export default Topbar;
