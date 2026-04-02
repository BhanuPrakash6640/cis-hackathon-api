import { motion } from "framer-motion";
import { Activity, Gauge, TrendingUp } from "lucide-react";
import { trafficSeries } from "../../data/dashboardData";
import { formatPercent } from "../../utils/formatters";

function AnalyticsPanel({ successRate }) {
  const chartHeight = 180;
  const chartWidth = 440;
  const maxTraffic = Math.max(...trafficSeries.map((point) => point.traffic));
  const linePath = trafficSeries
    .map((point, index) => {
      const x = (index / (trafficSeries.length - 1)) * chartWidth;
      const y = chartHeight - (point.traffic / maxTraffic) * (chartHeight - 12);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPath = `0,${chartHeight} ${linePath} ${chartWidth},${chartHeight}`;

  return (
    <div className="glass-card hover-lift overflow-hidden p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Traffic pulse</p>
          <h3 className="font-display text-2xl font-semibold text-slate-50">Latency & throughput</h3>
        </div>
        <div className="rounded-2xl border border-cyan-300/16 bg-cyan-300/10 p-3 text-cyan-100">
          <TrendingUp className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.75fr]">
        <div className="rounded-3xl border border-white/8 bg-slate-950/35 p-4">
          <svg
            className="h-[180px] w-full"
            preserveAspectRatio="none"
            role="img"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            <defs>
              <linearGradient id="traffic-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(103, 232, 249, 0.45)" />
                <stop offset="100%" stopColor="rgba(103, 232, 249, 0.03)" />
              </linearGradient>
              <linearGradient id="traffic-line" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>

            {trafficSeries.map((point, index) => {
              const x = (index / (trafficSeries.length - 1)) * chartWidth;
              return (
                <line
                  key={point.label}
                  stroke="rgba(148, 163, 184, 0.08)"
                  strokeDasharray="5 9"
                  x1={x}
                  x2={x}
                  y1="0"
                  y2={chartHeight}
                />
              );
            })}

            <polygon fill="url(#traffic-area)" points={areaPath} />
            <polyline
              fill="none"
              points={linePath}
              stroke="url(#traffic-line)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
          </svg>

          <div className="mt-4 grid grid-cols-4 gap-3 text-xs text-slate-400 sm:grid-cols-7">
            {trafficSeries.map((point) => (
              <div key={point.label}>
                <p className="text-slate-300">{point.label}</p>
                <p className="mt-1">{point.traffic} req</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <motion.div
            className="rounded-3xl border border-white/8 bg-slate-950/35 p-4"
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-300">Success rate</p>
              <Gauge className="h-4 w-4 text-cyan-200" />
            </div>
            <div className="mt-5 flex justify-center">
              <div
                className="flex h-28 w-28 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#67e8f9 ${successRate * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
                }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-950/90 font-display text-xl font-semibold text-slate-50">
                  {formatPercent(successRate)}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="rounded-3xl border border-white/8 bg-slate-950/35 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-300">Error budget</p>
              <Activity className="h-4 w-4 text-amber-200" />
            </div>
            <div className="mt-4 space-y-3">
              {trafficSeries.slice(-3).map((point) => (
                <div key={point.label}>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{point.label}</span>
                    <span>{point.errors} faults</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-white/6">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-amber-300 to-rose-400"
                      style={{ width: `${Math.max(18, point.errors * 8)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPanel;
