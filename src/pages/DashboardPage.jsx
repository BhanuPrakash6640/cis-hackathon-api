import {
  Command,
  ChartColumn,
  ArrowRight,
  TriangleAlert,
} from "lucide-react";
import RequestComposer from "../components/simulator/RequestComposer";
import ResponseConsole from "../components/simulator/ResponseConsole";
import { useAppState } from "../context/AppStateContext";
import {
  trafficSeries,
} from "../data/dashboardData";
import {
  formatBytes,
  formatDuration,
  formatNumber,
} from "../utils/formatters";

const accentClasses = {
  amber: "from-amber-400/22 via-amber-300/10 to-transparent text-amber-100",
  cyan: "from-sky-400/22 via-sky-300/10 to-transparent text-sky-100",
  emerald: "from-emerald-400/22 via-emerald-300/10 to-transparent text-emerald-100",
  rose: "from-rose-400/22 via-rose-300/10 to-transparent text-rose-100",
  sky: "from-cyan-400/22 via-cyan-300/10 to-transparent text-cyan-100",
  violet: "from-violet-400/22 via-violet-300/10 to-transparent text-violet-100",
};

const methodToneClasses = {
  amber: "border-amber-300/18 bg-amber-300/12 text-amber-100",
  emerald: "border-emerald-300/18 bg-emerald-300/12 text-emerald-100",
  rose: "border-rose-300/18 bg-rose-300/12 text-rose-100",
  sky: "border-sky-300/18 bg-sky-300/12 text-sky-100",
  slate: "border-slate-300/18 bg-slate-300/12 text-slate-100",
  violet: "border-violet-300/18 bg-violet-300/12 text-violet-100",
};

const statusToneClasses = {
  amber: "text-amber-200",
  emerald: "text-emerald-200",
  rose: "text-rose-200",
  sky: "text-sky-200",
};

const heroToneClasses = {
  amber: "badge-warning",
  cyan: "badge-info",
  emerald: "badge-good",
};

const alertToneClasses = {
  High: "badge-danger",
  Info: "badge-good",
  Medium: "badge-warning",
};

const healthToneClasses = {
  "Load spike": "badge-danger",
  Online: "badge-info",
  Stable: "badge-good",
  Watching: "badge-warning",
};

function SectionIntro({ title }) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">{title}</h2>
      </div>
    </div>
  );
}


function TrafficChart() {
  const chartHeight = 180;
  const chartWidth = 520;
  const maxTraffic = Math.max(...trafficSeries.map((point) => point.traffic));
  const maxLatency = Math.max(...trafficSeries.map((point) => point.latency));
  const trafficPath = trafficSeries
    .map((point, index) => {
      const x = (index / (trafficSeries.length - 1)) * chartWidth;
      const y = chartHeight - (point.traffic / maxTraffic) * (chartHeight - 20);
      return `${x},${y}`;
    })
    .join(" ");
  const areaPath = `0,${chartHeight} ${trafficPath} ${chartWidth},${chartHeight}`;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="surface-label">Traffic</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-slate-50">Traffic and latency</h3>
        </div>
        <span className="badge-neutral">
          <ChartColumn className="h-4 w-4" />
          Last 12 hours
        </span>
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-4">
        <svg className="h-[190px] w-full" preserveAspectRatio="none" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <defs>
            <linearGradient id="traffic-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.42)" />
              <stop offset="100%" stopColor="rgba(56, 189, 248, 0.02)" />
            </linearGradient>
            <linearGradient id="traffic-line" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>

          {trafficSeries.map((point, index) => {
            const x = (index / (trafficSeries.length - 1)) * chartWidth;
            const latencyHeight = (point.latency / maxLatency) * 80;

            return (
              <g key={point.label}>
                <line
                  stroke="rgba(148, 163, 184, 0.08)"
                  strokeDasharray="5 8"
                  x1={x}
                  x2={x}
                  y1="0"
                  y2={chartHeight}
                />
                <rect
                  fill="rgba(251, 191, 36, 0.18)"
                  height={latencyHeight}
                  rx="6"
                  width="16"
                  x={Math.max(0, x - 8)}
                  y={chartHeight - latencyHeight}
                />
              </g>
            );
          })}

          <polygon fill="url(#traffic-fill)" points={areaPath} />
          <polyline
            fill="none"
            points={trafficPath}
            stroke="url(#traffic-line)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
        </svg>

        <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-400 sm:grid-cols-7">
          {trafficSeries.map((point) => (
            <div key={point.label}>
              <p className="text-slate-200">{point.label}</p>
              <p className="mt-1">{point.traffic} req</p>
              <p>{point.latency} ms</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecentRequestsTable({ items }) {
  if (!items.length) {
    return (
      <div className="glass-card flex min-h-[420px] items-center justify-center p-6">
        <div className="max-w-lg text-center">
          <p className="font-display text-2xl font-semibold text-slate-50">No requests match this view</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="hidden grid-cols-[110px_1.45fr_110px_120px_110px_130px] gap-4 border-b border-white/10 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 lg:grid">
        <span>Method</span>
        <span>Endpoint</span>
        <span>Status</span>
        <span>Latency</span>
        <span>Size</span>
        <span>Trace ID</span>
      </div>

      <div className="divide-y divide-white/8">
        {items.map((item) => {
          return (
            <div
              key={item.id}
              className="grid gap-4 px-5 py-5 transition hover:bg-white/[0.03] lg:grid-cols-[110px_1.45fr_110px_120px_110px_130px]"
            >
              <div>
                <span className="inline-flex rounded-full border border-sky-300/18 bg-sky-300/12 px-3 py-2 text-xs font-semibold text-sky-100">
                  {item.method}
                </span>
              </div>

              <div>
                <p className="break-all text-sm font-medium text-slate-50">{item.endpoint}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.environment} | {item.source} | {item.timestamp}
                </p>
                {item.errorMessage ? (
                  <p className="mt-2 text-xs text-rose-200/82">{item.errorMessage}</p>
                ) : null}
              </div>

              <div className="text-sm font-semibold text-sky-200">
                {item.status || "ERR"}
              </div>
              <div className="text-sm text-slate-300">{formatDuration(item.duration)}</div>
              <div className="text-sm text-slate-300">{formatBytes(item.responseSize)}</div>
              <div className="text-sm text-slate-400">{item.traceId}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}




function RecentFailuresWidget({ items }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="surface-label">Recent Failures</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-slate-50">Items to check</h3>
        </div>
        <span className={items.length ? "badge-danger" : "badge-good"}>
          <TriangleAlert className="h-4 w-4" />
          {items.length ? `${items.length} open` : "Clear"}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {items.length ? (
          items.map((item) => (
            <div key={item.id} className="rounded-[1.3rem] border border-white/10 bg-white/[0.04] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-100">{item.endpoint}</p>
                <span className="badge-warning">{item.status || "ERR"}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {item.environment} | {formatDuration(item.duration)} | {item.timestamp}
              </p>
              {item.errorMessage ? (
                <p className="mt-3 text-sm leading-6 text-rose-200/74">{item.errorMessage}</p>
              ) : null}
            </div>
          ))
        ) : (
          <div className="rounded-[1.3rem] border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400">
            No failures right now. Run the 401 example if you want to exercise the error states.
          </div>
        )}
      </div>
    </div>
  );
}




function DashboardPage({ onNavigate }) {
  const {
    filteredHistory,
    recentFailures,
  } = useAppState();

  return (
    <div className="space-y-8">
      <section className="scroll-mt-32 space-y-6" data-section="overview" id="overview">
        <div className="glass-shell relative overflow-hidden px-6 py-6 sm:px-8 sm:py-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_18%,rgba(56,189,248,0.18),transparent_24%),radial-gradient(circle_at_12%_100%,rgba(34,197,94,0.16),transparent_28%)]" />
          <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-hero-grid bg-[length:52px_52px] opacity-[0.06] xl:block" />

          <div className="relative">
            <div className="max-w-5xl">
              <div className="badge-neutral">
                <Command className="h-4 w-4 text-sky-200" />
                API request workspace
              </div>

              <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl xl:text-[4.15rem]">
                Run requests, inspect responses, and keep the last few issues in one place.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300/78 sm:text-lg">
                Send live requests, compare payloads, scan recent failures, and save the examples
                your team keeps coming back to.
              </p>


              <div className="mt-8 flex flex-wrap gap-3">
                <button className="button-primary" onClick={() => onNavigate("api-tester")} type="button">
                  Try a request
                </button>
                <button className="button-secondary" onClick={() => onNavigate("replay-console")} type="button">
                  See latest response
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>

            </div>
          </div>
        </div>

      </section>

      <section className="scroll-mt-32 space-y-4" data-section="api-tester" id="api-tester">
        <SectionIntro
          title="A request builder"
        />
        <RequestComposer />
      </section>

      <section className="scroll-mt-32 space-y-4" data-section="replay-console" id="replay-console">
        <SectionIntro
          title="Response details"
        />
        <ResponseConsole />
      </section>

      <section className="scroll-mt-32 space-y-4" data-section="pulse-monitor" id="pulse-monitor">
        <SectionIntro
          title="Recent activity"
        />

        <div className="grid gap-4 2xl:grid-cols-[1.18fr_0.82fr]">
          <RecentRequestsTable items={filteredHistory} />
          <div className="grid gap-4">
            <TrafficChart />
            <RecentFailuresWidget items={recentFailures} />
          </div>
        </div>

      </section>

    </div>
  );
}

export default DashboardPage;

