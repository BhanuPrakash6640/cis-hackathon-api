import { SearchX } from "lucide-react";
import { useAppState } from "../../context/AppStateContext";
import { formatBytes, formatDuration, getMethodTone, getStatusTone } from "../../utils/formatters";
import EmptyState from "../common/EmptyState";

const methodToneClasses = {
  amber: "border-amber-300/18 bg-amber-300/10 text-amber-100",
  emerald: "border-emerald-300/18 bg-emerald-300/10 text-emerald-100",
  rose: "border-rose-300/18 bg-rose-300/10 text-rose-100",
  sky: "border-sky-300/18 bg-sky-300/10 text-sky-100",
  slate: "border-slate-300/18 bg-slate-300/10 text-slate-100",
  violet: "border-violet-300/18 bg-violet-300/10 text-violet-100",
};

const statusToneClasses = {
  amber: "text-amber-200",
  emerald: "text-emerald-200",
  rose: "text-rose-200",
  sky: "text-sky-200",
};

function HistoryTable() {
  const { filteredHistory, searchQuery } = useAppState();

  if (!filteredHistory.length) {
    return (
      <div className="glass-card p-5">
        <EmptyState
          description={
            searchQuery
              ? "No recent traces match the current search filter."
              : "Requests sent from the live console will appear here."
          }
          icon={SearchX}
          title="No matching history"
        />
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="hidden grid-cols-[110px_1.6fr_110px_120px_110px_140px] gap-4 border-b border-white/8 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 lg:grid">
        <span>Method</span>
        <span>Endpoint</span>
        <span>Status</span>
        <span>Latency</span>
        <span>Size</span>
        <span>Source</span>
      </div>

      <div className="divide-y divide-white/8">
        {filteredHistory.map((item) => {
          const methodTone = getMethodTone(item.method);
          const statusTone = getStatusTone(item.status);

          return (
            <div
              key={item.id}
              className="grid gap-4 px-5 py-5 transition hover:bg-white/[0.03] lg:grid-cols-[110px_1.6fr_110px_120px_110px_140px]"
            >
              <div>
                <span
                  className={`inline-flex rounded-full border px-3 py-2 text-xs font-semibold ${methodToneClasses[methodTone]}`}
                >
                  {item.method}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-50">{item.endpoint}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.environment} • {item.timestamp}
                </p>
                {item.errorMessage ? (
                  <p className="mt-2 text-xs text-rose-200/80">{item.errorMessage}</p>
                ) : null}
              </div>

              <div className={`text-sm font-semibold ${statusToneClasses[statusTone]}`}>
                {item.status || "ERR"}
              </div>
              <div className="text-sm text-slate-300">{formatDuration(item.duration)}</div>
              <div className="text-sm text-slate-300">{formatBytes(item.responseSize)}</div>
              <div className="text-sm text-slate-400">{item.source}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HistoryTable;
