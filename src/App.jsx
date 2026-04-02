import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navigationItems } from "./data/dashboardData";
import { useAppState } from "./context/AppStateContext";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import DashboardPage from "./pages/DashboardPage";

const sectionSelector = "[data-section]";

function App() {
  const { activeSection, setActiveSection } = useAppState();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll(sectionSelector));

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-18% 0px -44% 0px",
        threshold: [0.2, 0.45, 0.72],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [setActiveSection]);

  const handleNavigate = (sectionId) => {
    const target = document.getElementById(sectionId);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setActiveSection(sectionId);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-canvas text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_24%),radial-gradient(circle_at_82%_10%,_rgba(16,185,129,0.14),_transparent_18%),radial-gradient(circle_at_70%_72%,_rgba(59,130,246,0.12),_transparent_22%)]" />
        <div className="absolute left-[-8rem] top-[22rem] h-72 w-72 rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute right-[-5rem] top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-[110px]" />
      </div>

      <Sidebar
        activeSection={activeSection}
        isOpen={isSidebarOpen}
        items={navigationItems}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={handleNavigate}
      />

      <div className="relative lg:pl-[19.5rem]">
        <Topbar
          onMenuToggle={() => setIsSidebarOpen((open) => !open)}
          onNavigate={handleNavigate}
        />

        <motion.main
          className="relative z-10 px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28 xl:px-10"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <DashboardPage onNavigate={handleNavigate} />
        </motion.main>
      </div>
    </div>
  );
}

export default App;
