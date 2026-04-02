import { motion } from "framer-motion";
import {
  ArrowRight,
  ChartColumn,
  Command,
  Radar,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import RequestComposer from "../components/simulator/RequestComposer";
import ResponseConsole from "../components/simulator/ResponseConsole";
import { useAppState } from "../context/AppStateContext";
import {
  commandDeckHighlights,
  endpointHealth,
  heroMiniMetrics,
  heroStatusPills,
  insightAlerts,
  insightPlaybook,
  kpiDefinitions,
  settingsCards,
  trafficSeries,
} from "../data/dashboardData";
import {
  formatBytes,
  formatDuration,
  formatNumber,
  formatPercent,
  getMethodTone,
  getStatusTone,
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

function SectionIntro({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className="surface-label">{eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-slate-50">{title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300/74">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function KpiCard({ accent, footnote, icon: Icon, label, trend, value }) {
  return (
    <motion.article
      className="glass-card hover-lift relative overflow-hidden px-5 py-5"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${accentClasses[accent]} opacity-80`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-300/82">{label}</p>
          <p className="mt-3 font-display text-3xl font-semibold text-slate-50">{value}</p>
        </div>
        <div className="rounded-[1rem] border border-white/10 bg-white/[0.06] p-3">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="relative mt-5">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-200">{trend}</span>
          <span className="text-right text-slate-500">{footnote}</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-white/[0.05]">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${accentClasses[accent].split(" ").slice(0, 3).join(" ")}`}
            style={{ width: "72%" }}
          />
        </div>
      </div>
    </motion.article>
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
          <p className="surface-label">Response Trend</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-slate-50">
            Traffic pulse and latency envelope
          </h3>
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
          <p className="font-display text-2xl font-semibold text-slate-50">
            No request traces match the current view
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Adjust the global search or dispatch a fresh probe to refill the replay history.
          </p>
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
          const methodTone = getMethodTone(item.method);
          const statusTone = getStatusTone(item.status);

          return (
            <div
              key={item.id}
              className="grid gap-4 px-5 py-5 transition hover:bg-white/[0.03] lg:grid-cols-[110px_1.45fr_110px_120px_110px_130px]"
            >
              <div>
                <span
                  className={`inline-flex rounded-full border px-3 py-2 text-xs font-semibold ${methodToneClasses[methodTone]}`}
                >
                  {item.method}
                </span>
              </div>

              <div>
                <p className="break-all text-sm font-medium text-slate-50">{item.endpoint}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.environment} • {item.source} • {item.timestamp}
                </p>
                {item.errorMessage ? (
                  <p className="mt-2 text-xs text-rose-200/82">{item.errorMessage}</p>
                ) : null}
              </div>

              <div className={`text-sm font-semibold ${statusToneClasses[statusTone]}`}>
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

function EndpointHealthGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {endpointHealth.map((endpoint) => (
        <div key={endpoint.name} className="glass-card hover-lift p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-xl font-semibold text-slate-50">{endpoint.name}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{endpoint.coverage}</p>
            </div>
            <span className={healthToneClasses[endpoint.status]}>{endpoint.status}</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Uptime</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{endpoint.uptime}</p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Observed latency</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{endpoint.latency}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CollectionsPreview({ items }) {
  if (!items.length) {
    return (
      <div className="glass-card flex min-h-[260px] items-center justify-center p-6">
        <div className="max-w-md text-center">
          <p className="font-display text-2xl font-semibold text-slate-50">
            No collections in the current lens
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Save the active request or clear the search filter to bring curated replay packs back into
            view.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {items.map((collection) => (
        <div key={collection.id} className="glass-card hover-lift p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-xl font-semibold text-slate-50">{collection.name}</p>
              <p className="mt-1 text-sm text-slate-400">{collection.owner}</p>
            </div>
            <span className="badge-info">{collection.requestCount} requests</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300/74">{collection.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {collection.tags.map((tag) => (
              <span key={tag} className="badge-neutral">
                #{tag}
              </span>
            ))}
          </div>
          <div className="mt-5 border-t border-white/8 pt-4 text-sm text-slate-400">
            Last updated {collection.lastUpdated}
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentFailuresWidget({ items }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="surface-label">Recent Failures</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-slate-50">Triage queue</h3>
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
                {item.environment} • {formatDuration(item.duration)} • {item.timestamp}
              </p>
              {item.errorMessage ? (
                <p className="mt-3 text-sm leading-6 text-rose-200/74">{item.errorMessage}</p>
              ) : null}
            </div>
          ))
        ) : (
          <div className="rounded-[1.3rem] border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400">
            No failing traces right now. Use Auth Breaker to demo the diagnosis lane.
          </div>
        )}
      </div>
    </div>
  );
}

function InsightAlertsPanel() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="surface-label">Insight Alerts</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-slate-50">
            AI-ranked operational signals
          </h3>
        </div>
        <span className="badge-neutral">
          <Sparkles className="h-4 w-4" />
          Ranked in real time
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {insightAlerts.map((alert) => (
          <div key={alert.title} className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-100">{alert.title}</p>
                  <span className={alertToneClasses[alert.severity]}>{alert.severity}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-400">{alert.detail}</p>
              </div>
              <div className="shrink-0 rounded-[1.1rem] border border-white/10 bg-slate-950/55 px-3 py-3 text-sm text-slate-300">
                <p>{alert.time}</p>
                <p className="mt-1 text-slate-500">{alert.owner}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 rounded-[1.1rem] border border-white/10 bg-slate-950/40 px-3 py-3 text-sm">
              <span className="text-slate-400">Recommended move</span>
              <span className="text-slate-100">{alert.action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightPlaybookPanel() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="surface-label">Demo Narrative</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-slate-50">
            Three moves that land the product story
          </h3>
        </div>
        <span className="badge-good">
          <ShieldCheck className="h-4 w-4" />
          Judge friendly
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {insightPlaybook.map((item, index) => (
          <div key={item.title} className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4">
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-300/18 bg-sky-300/12 text-sm font-semibold text-sky-100">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-sky-200" />
                  <p className="font-semibold text-slate-100">{item.title}</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-400">{item.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsDeck({ demoMode, readinessScore, selectedEnvironment }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        {settingsCards.map((item) => (
          <div key={item.title} className="glass-card hover-lift p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-100">{item.title}</p>
              <div className="rounded-[1rem] border border-white/10 bg-white/[0.06] p-2.5 text-sky-100">
                <item.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 font-display text-2xl font-semibold text-slate-50">{item.value}</p>
            <p className="mt-3 text-sm leading-7 text-slate-400">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="glass-shell p-6">
        <p className="surface-label">Control Surface</p>
        <h3 className="mt-2 font-display text-3xl font-semibold text-slate-50">
          Launch posture stays visible
        </h3>
        <div className="mt-6 grid gap-4">
          <div className="glass-subpanel px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-400">Demo mode</span>
              <span className={demoMode ? "badge-good" : "badge-neutral"}>
                {demoMode ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
          <div className="glass-subpanel px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-400">Environment</span>
              <span className="badge-info">{selectedEnvironment}</span>
            </div>
          </div>
          <div className="glass-subpanel px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-400">Readiness score</span>
              <span className="badge-good">{readinessScore}/100</span>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/[0.06]">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          </div>
          <div className="glass-subpanel px-4 py-4 text-sm leading-7 text-slate-400">
            Keep this section near the end of the walkthrough to reinforce that the product is not
            just a stylish API client, but a deployable operational surface.
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ onNavigate }) {
  const {
    activeAlerts,
    averageResponseTime,
    demoMode,
    filteredCollections,
    filteredHistory,
    readinessScore,
    recentFailures,
    selectedEnvironment,
    slowEndpointCount,
    slowestHistoryEntry,
    successRate,
    totalRequests,
  } = useAppState();

  const statValues = {
    "active-alerts": {
      trend: `${recentFailures.length} elevated traces in view`,
      value: formatNumber(activeAlerts),
    },
    "average-response": {
      trend: "Latency envelope held under 300 ms for healthy flows",
      value: formatDuration(averageResponseTime),
    },
    "readiness-score": {
      trend: demoMode ? "Judge deck is armed and motion-ready" : "Demo motion is paused",
      value: `${readinessScore}/100`,
    },
    "slow-endpoints": {
      trend: slowestHistoryEntry.endpoint,
      value: formatNumber(slowEndpointCount),
    },
    "success-rate": {
      trend: "Healthy 2xx and 3xx responses dominate the replay lane",
      value: formatPercent(successRate),
    },
    "total-requests": {
      trend: "Replay volume stays presentation-ready and operationally dense",
      value: formatNumber(totalRequests),
    },
  };

  return (
    <div className="space-y-8">
      <section className="scroll-mt-32 space-y-6" data-section="overview" id="overview">
        <div className="glass-shell relative overflow-hidden px-6 py-6 sm:px-8 sm:py-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_18%,rgba(56,189,248,0.18),transparent_24%),radial-gradient(circle_at_12%_100%,rgba(34,197,94,0.16),transparent_28%)]" />
          <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-hero-grid bg-[length:52px_52px] opacity-[0.06] xl:block" />

          <div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="badge-neutral">
                <Command className="h-4 w-4 text-sky-200" />
                Premium API operations surface
              </div>

              <h1 className="mt-5 max-w-4xl font-display text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl xl:text-[4.15rem]">
                CIS Hackathon is the <span className="text-gradient">developer command center</span> for every critical API moment.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300/78 sm:text-lg">
                Test live endpoints, replay golden paths, monitor fleet health, and explain failures
                from a single premium control surface built to impress technical judges and real operators.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {heroStatusPills.map((pill) => (
                  <span key={pill.label} className={heroToneClasses[pill.tone]}>
                    <pill.icon className="h-4 w-4" />
                    {pill.label}
                    <span className="text-slate-200/78">{pill.value}</span>
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button className="button-primary" onClick={() => onNavigate("api-tester")} type="button">
                  Launch API probe
                </button>
                <button className="button-secondary" onClick={() => onNavigate("replay-console")} type="button">
                  Open replay console
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {heroMiniMetrics.map((item) => (
                  <div key={item.title} className="glass-subpanel px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{item.title}</p>
                    <p className="mt-3 font-display text-2xl font-semibold text-slate-50">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="glass-card overflow-hidden p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="surface-label">Command Deck</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-slate-50">
                      Everything the judges need to see
                    </h3>
                  </div>
                  <span className="badge-good">
                    <ShieldCheck className="h-4 w-4" />
                    {selectedEnvironment}
                  </span>
                </div>

                <div className="mt-5 grid gap-3">
                  {commandDeckHighlights.map((item) => (
                    <div key={item.title} className="rounded-[1.3rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-[1rem] border border-white/10 bg-white/[0.05] p-2.5 text-sky-100">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-100">{item.title}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="surface-label">Live Readiness</p>
                    <p className="mt-2 font-display text-2xl font-semibold text-slate-50">
                      {readinessScore}/100 launch confidence
                    </p>
                  </div>
                  <span className="badge-neutral">
                    <Radar className="h-4 w-4" />
                    Dense signal
                  </span>
                </div>
                <div className="mt-5 h-2 rounded-full bg-white/[0.06]">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300"
                    style={{ width: `${readinessScore}%` }}
                  />
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  The workspace balances healthy baselines, real anomalies, polished motion, and
                  product-language copy to make the walkthrough feel launch-ready.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-6">
          {kpiDefinitions.map((stat) => (
            <KpiCard
              key={stat.id}
              accent={stat.accent}
              footnote={stat.footnote}
              icon={stat.icon}
              label={stat.label}
              trend={statValues[stat.id].trend}
              value={statValues[stat.id].value}
            />
          ))}
        </div>
      </section>

      <section className="scroll-mt-32 space-y-4" data-section="api-tester" id="api-tester">
        <SectionIntro
          action={
            <span className="badge-info">
              <Sparkles className="h-4 w-4" />
              Power-user console
            </span>
          }
          description="The request builder now behaves like a serious API workstation: strong method controls, live sample flows, quick actions, and contract-aware tabs."
          eyebrow="Compose"
          title="API tester built for speed, clarity, and showmanship"
        />
        <RequestComposer />
      </section>

      <section className="scroll-mt-32 space-y-4" data-section="replay-console" id="replay-console">
        <SectionIntro
          action={
            <span className="badge-neutral">
              <Command className="h-4 w-4" />
              Multi-tab analysis
            </span>
          }
          description="The response workspace feels like an observability product, not a textarea. Judges can see the payload, the timing story, the baseline diff, and the diagnosis without leaving the surface."
          eyebrow="Inspect"
          title="Replay console that turns responses into narrative"
        />
        <ResponseConsole />
      </section>

      <section className="scroll-mt-32 space-y-4" data-section="pulse-monitor" id="pulse-monitor">
        <SectionIntro
          action={
            <span className="badge-good">
              <Radar className="h-4 w-4" />
              Fleet pulse live
            </span>
          }
          description="Below the tester, the page stays dense with monitoring surfaces: replay history, endpoint health, trend tracking, and a live triage queue."
          eyebrow="Pulse Monitor"
          title="Operational signal stays visible after the request lands"
        />

        <div className="grid gap-4 2xl:grid-cols-[1.18fr_0.82fr]">
          <RecentRequestsTable items={filteredHistory} />
          <div className="grid gap-4">
            <TrafficChart />
            <RecentFailuresWidget items={recentFailures} />
          </div>
        </div>

        <EndpointHealthGrid />
      </section>

      <section className="scroll-mt-32 space-y-4" data-section="collections" id="collections">
        <SectionIntro
          action={
            <span className="badge-neutral">
              <ShieldCheck className="h-4 w-4" />
              Shared replay packs
            </span>
          }
          description="Collections now read like deployable workflows instead of generic folders, reinforcing that CIS Hackathon can move from single-request demos into repeatable operational playbooks."
          eyebrow="Collections"
          title="Curated request packs keep the best flows one click away"
        />
        <CollectionsPreview items={filteredCollections} />
      </section>

      <section className="scroll-mt-32 space-y-4" data-section="insight-engine" id="insight-engine">
        <SectionIntro
          action={
            <span className="badge-warning">
              <TriangleAlert className="h-4 w-4" />
              Ranked anomalies
            </span>
          }
          description="Insight Engine closes the loop by turning raw alerts into clear, premium operator guidance and a crisp three-step demo narrative."
          eyebrow="Insight Engine"
          title="Diagnosis, prioritization, and storytelling in one lane"
        />

        <div className="grid gap-4 2xl:grid-cols-[1.05fr_0.95fr]">
          <InsightAlertsPanel />
          <InsightPlaybookPanel />
        </div>
      </section>

      <section className="scroll-mt-32 space-y-4" data-section="settings" id="settings">
        <SectionIntro
          action={
            <span className="badge-info">
              <Sparkles className="h-4 w-4" />
              Launch posture
            </span>
          }
          description="The final section reinforces product maturity: environment routing, alerting posture, replay density, and demo mode stay explicit instead of hidden in generic settings UI."
          eyebrow="Settings"
          title="Workspace controls that still feel premium on stage"
        />
        <SettingsDeck
          demoMode={demoMode}
          readinessScore={readinessScore}
          selectedEnvironment={selectedEnvironment}
        />
      </section>
    </div>
  );
}

export default DashboardPage;
