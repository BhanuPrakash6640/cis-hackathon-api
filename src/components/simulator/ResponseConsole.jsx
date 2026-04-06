import { motion } from "framer-motion";
import {
  Bot,
  Braces,
  Copy,
  FileCode2,
  LoaderCircle,
  Sparkles,
  Timer,
  TriangleAlert,
  Waypoints,
} from "lucide-react";
import { useAppState } from "../../context/AppStateContext";
import { formatBytes, formatDuration } from "../../utils/formatters";

const responseTabs = [
  { id: "response", label: "Response" },
  { id: "insights", label: "Issues" },
  { id: "diff", label: "Diff" },
  { id: "timeline", label: "Timing" },
  { id: "diagnosis", label: "Diagnosis" },
];

function getSchemaSignal(response) {
  if (!response) {
    return {
      className: "badge-neutral",
      label: "No contract yet",
    };
  }

  if (response.contentType.includes("application/json") && response.ok) {
    return {
      className: "badge-good",
      label: "Looks good",
    };
  }

  if (response.contentType.includes("application/json")) {
    return {
      className: "badge-warning",
      label: "Needs a check",
    };
  }

  return {
    className: "badge-neutral",
    label: "Unverified",
  };
}

function buildTimeline(response) {
  const total = Math.max(response?.duration ?? 0, 120);
  const handshake = Math.max(16, Math.round(total * 0.18));
  const auth = Math.max(22, Math.round(total * 0.2));
  const upstream = Math.max(28, Math.round(total * 0.42));
  const decode = Math.max(14, total - handshake - auth - upstream);

  return [
    {
      label: "Handshake",
      detail: "DNS, TLS, and gateway checks",
      duration: handshake,
    },
    {
      label: "Auth + routing",
      detail: "Scopes, rate limits, and route selection",
      duration: auth,
    },
    {
      label: "Upstream work",
      detail: "Application logic and downstream calls",
      duration: upstream,
    },
    {
      label: "Decode",
      detail: "Payload parsing and screen render",
      duration: decode,
    },
  ];
}

function buildDiffItems(response, baseline) {
  if (!response) {
    return [];
  }

  const baselineDuration = baseline?.duration ?? 286;
  const baselineSize = baseline?.responseSize ?? 1180;
  const durationDelta = response.duration - baselineDuration;
  const sizeDelta = response.size - baselineSize;

  return [
    {
      label: "Status shift",
      value: baseline ? `${baseline.status} -> ${response.status}` : `${response.status} current`,
      detail:
        response.ok
          ? "Compares the current status with the nearest healthy request."
          : "The current request differs from the closest healthy comparison.",
    },
    {
      label: "Latency delta",
      value: `${durationDelta >= 0 ? "+" : ""}${durationDelta} ms`,
      detail: "Difference between this request and the comparison request.",
    },
    {
      label: "Payload delta",
      value: `${sizeDelta >= 0 ? "+" : ""}${formatBytes(Math.abs(sizeDelta))}`,
      detail: "Useful for spotting missing fields, larger payloads, or empty responses.",
    },
    {
      label: "Format check",
      value: response.contentType,
      detail: "Content type returned by the server.",
    },
  ];
}

function EmptyWorkspace() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
      <div className="rounded-[1.4rem] border border-sky-300/18 bg-sky-300/12 p-4 shadow-glow">
        <FileCode2 className="h-7 w-7 text-sky-100" />
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold text-slate-50">No response yet</h3>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300/72">
        Run a request to fill this area with the payload, timing, diff, and diagnosis views.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <span className="badge-neutral">Response payload</span>
        <span className="badge-neutral">Diff against baseline</span>
        <span className="badge-neutral">Suggested diagnosis</span>
      </div>
    </div>
  );
}

function LoadingWorkspace() {
  return (
    <div className="min-h-[420px] px-1">
      <div className="flex items-center gap-3">
        <div className="rounded-[1.2rem] border border-sky-300/18 bg-sky-300/12 p-3">
          <LoaderCircle className="h-5 w-5 animate-spin text-sky-100" />
        </div>
        <div>
          <p className="font-display text-xl font-semibold text-slate-50">Sending request</p>
          <p className="mt-1 text-sm text-slate-400">
            Waiting for status, headers, payload, and timing data.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="glass-subpanel p-4">
          <div className="skeleton h-5 w-32" />
          <div className="mt-4 space-y-3">
            <div className="skeleton h-14 w-full" />
            <div className="skeleton h-14 w-full" />
            <div className="skeleton h-14 w-full" />
          </div>
        </div>

        <div className="glass-subpanel p-4">
          <div className="skeleton h-5 w-40" />
          <div className="mt-4 space-y-3">
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-10 w-[86%]" />
            <div className="skeleton h-44 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorWorkspace({ errorMessage, insights }) {
  return (
    <div className="min-h-[420px]">
      <div className="glass-subpanel border-rose-300/18 bg-rose-300/10 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="badge-danger">
              <TriangleAlert className="h-4 w-4" />
              Request failed
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-slate-50">
              The request failed before a response came back
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200/82">{errorMessage}</p>
          </div>

          <div className="glass-subpanel border-white/10 bg-slate-950/40 px-4 py-4">
            <p className="surface-label">Suggested next step</p>
            <p className="mt-2 font-semibold text-slate-50">
              Try a known-good request, then compare the URL and auth settings.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {insights.map((insight) => (
          <div key={insight.title} className="glass-subpanel px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-100">{insight.title}</p>
              <span className={insight.severity === "High" ? "badge-danger" : "badge-info"}>
                {insight.severity}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">{insight.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResponseConsole() {
  const {
    debuggerInsights,
    history,
    latestSuccessfulRequest,
    requestState,
    response,
    responseTab,
    setResponseTab,
  } = useAppState();

  const comparisonTrace =
    history.find((item) => item.endpoint !== response?.url && item.status > 0 && item.status < 400) ??
    latestSuccessfulRequest;
  const diffItems = buildDiffItems(response, comparisonTrace);
  const timeline = buildTimeline(response);
  const schemaSignal = getSchemaSignal(response);
  const responseDuration = Math.max(response?.duration ?? 0, 1);

  if (requestState.loading) {
    return (
      <div className="glass-card p-6">
        <LoadingWorkspace />
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="surface-label">Response Viewer</p>
          <h3 className="mt-2 font-display text-3xl font-semibold text-slate-50">
            See the response, timing, and likely issue
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300/76">
            Payload, timing, diff, and diagnosis stay together so you can scan the important parts
            quickly.
          </p>
        </div>

        {response ? (
          <button
            className="button-secondary shrink-0"
            onClick={() => navigator.clipboard?.writeText(response.body)}
            type="button"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy response
          </button>
        ) : null}
      </div>

      {response ? (
        <div className="mt-5 flex flex-wrap gap-2">
          <span className={response.ok ? "badge-good" : "badge-danger"}>
            <Waypoints className="h-4 w-4" />
            {response.status} {response.statusText}
          </span>
          <span className="badge-neutral">
            <Timer className="h-4 w-4" />
            {formatDuration(response.duration)}
          </span>
          <span className="badge-neutral">
            <FileCode2 className="h-4 w-4" />
            {formatBytes(response.size)}
          </span>
          <span className={schemaSignal.className}>
            <Braces className="h-4 w-4" />
            {schemaSignal.label}
          </span>
        </div>
      ) : null}

      {!requestState.error ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {responseTabs.map((tab) => (
            <button
              key={tab.id}
              className={`pill-tab ${responseTab === tab.id ? "pill-tab-active" : ""}`}
              onClick={() => setResponseTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-5">
        {requestState.error ? (
          <ErrorWorkspace errorMessage={requestState.error.message} insights={debuggerInsights} />
        ) : !response ? (
          <EmptyWorkspace />
        ) : (
          <motion.div
            key={responseTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {responseTab === "insights" ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {debuggerInsights.map((insight) => (
                  <div key={insight.title} className="glass-subpanel px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-100">{insight.title}</p>
                      <span
                        className={
                          insight.severity === "High"
                            ? "badge-danger"
                            : insight.severity === "Medium"
                              ? "badge-warning"
                              : insight.severity === "Action"
                                ? "badge-info"
                                : "badge-good"
                        }
                      >
                        {insight.severity}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{insight.detail}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {responseTab === "diff" ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {diffItems.map((item) => (
                  <div key={item.label} className="glass-subpanel px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
                    <p className="mt-2 font-display text-2xl font-semibold text-slate-50">{item.value}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{item.detail}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {responseTab === "timeline" ? (
              <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="glass-subpanel px-4 py-4">
                  <p className="text-sm font-semibold text-slate-100">Request timing</p>
                  <div className="mt-4 space-y-4">
                    {timeline.map((step) => (
                      <div key={step.label}>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-slate-100">{step.label}</span>
                          <span className="text-slate-400">{formatDuration(step.duration)}</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/[0.06]">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-sky-300 to-emerald-300"
                            style={{
                              width: `${Math.max(18, (step.duration / responseDuration) * 100)}%`,
                            }}
                          />
                        </div>
                        <p className="mt-2 text-sm text-slate-400">{step.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-subpanel px-4 py-4">
                  <p className="text-sm font-semibold text-slate-100">Request summary</p>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Endpoint</p>
                      <p className="mt-2 break-all text-sm text-slate-100">{response.url}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Content type</p>
                      <p className="mt-2 text-sm text-slate-100">{response.contentType}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current state</p>
                      <p className="mt-2 text-sm text-slate-100">
                        {response.ok
                          ? "Healthy result. Good candidate for a baseline."
                          : "Problematic result. Worth keeping visible while you debug."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {responseTab === "diagnosis" ? (
              <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                <div className="glass-subpanel px-5 py-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-[1rem] border border-sky-300/18 bg-sky-300/12 p-3 text-sky-100">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-100">Likely cause</p>
                      <p className="mt-1 text-sm text-slate-400">
                        These notes are based on the current response state.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Main finding</p>
                    <p className="mt-3 font-display text-2xl font-semibold text-slate-50">
                      {debuggerInsights[0]?.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{debuggerInsights[0]?.detail}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="glass-subpanel px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-200" />
                      <p className="text-sm font-semibold text-slate-100">Suggested next step</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {response.ok
                        ? "Save this result if you want a clean baseline, then run one failing example for comparison."
                        : "Compare this result against a healthy request, then verify auth and response format before retrying."}
                    </p>
                  </div>
                  <div className="glass-subpanel px-4 py-4">
                    <div className="flex items-center gap-2">
                      <TriangleAlert className="h-4 w-4 text-amber-200" />
                      <p className="text-sm font-semibold text-slate-100">Why it matters</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {!response.ok || response.duration > 900
                        ? "This request should stay visible in the traffic view until the status, timing, or payload goes back to normal."
                        : "This result is stable enough to use as a baseline for future checks."}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {responseTab === "response" ? (
              <div className="grid gap-4 xl:grid-cols-[0.94fr_1.06fr]">
                <div className="grid gap-4">
                  <div className="glass-subpanel px-4 py-4">
                    <p className="text-sm font-semibold text-slate-100">Response summary</p>
                    <div className="mt-4 grid gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Status</p>
                        <p className="mt-2 text-sm text-slate-100">
                          {response.status} {response.statusText}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Content type</p>
                        <p className="mt-2 text-sm text-slate-100">{response.contentType}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Notes</p>
                        <p className="mt-2 text-sm text-slate-100">
                          {response.ok
                            ? "Healthy response captured. Use it as the baseline for diff and diagnosis."
                            : "This response is a good example of a failure case to compare against a healthy result."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <pre className="code-window max-h-[560px]">{response.body}</pre>
              </div>
            ) : null}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ResponseConsole;
