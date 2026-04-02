import { motion } from "framer-motion";
import {
  BookmarkPlus,
  Braces,
  FileCode2,
  Play,
  SendHorizonal,
  Sparkles,
} from "lucide-react";
import { useAppState } from "../../context/AppStateContext";

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const methodToneClasses = {
  DELETE: "border-rose-300/20 bg-rose-300/12 text-rose-100",
  GET: "border-sky-300/20 bg-sky-300/12 text-sky-100",
  PATCH: "border-amber-300/20 bg-amber-300/12 text-amber-100",
  POST: "border-emerald-300/20 bg-emerald-300/12 text-emerald-100",
  PUT: "border-violet-300/20 bg-violet-300/12 text-violet-100",
};

const requestTabs = [
  { id: "body", label: "Body", detail: "Payload editor" },
  { id: "headers", label: "Headers", detail: "Transport control" },
  { id: "params", label: "Params", detail: "Query shaping" },
  { id: "schema", label: "Schema", detail: "Contract notes" },
];

function parseEntries(block) {
  return block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.includes("=") ? line.indexOf("=") : line.indexOf(":");

      if (separatorIndex === -1) {
        return {
          key: line,
          value: "pending",
        };
      }

      return {
        key: line.slice(0, separatorIndex).trim(),
        value: line.slice(separatorIndex + 1).trim(),
      };
    });
}

function DetailCard({ label, value, detail }) {
  return (
    <div className="glass-subpanel px-4 py-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 font-display text-xl font-semibold text-slate-50">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
    </div>
  );
}

function RequestComposer() {
  const {
    activePresetIndex,
    applyPreset,
    exportRequestCode,
    generateTestBlueprint,
    loadNextPreset,
    requestDraft,
    requestPanelTab,
    requestPresets,
    requestState,
    saveCurrentRequest,
    selectedEnvironment,
    sendRequest,
    setRequestPanelTab,
    updateRequestField,
  } = useAppState();

  const activePreset = requestPresets[activePresetIndex] ?? requestPresets[0];
  const paramEntries = parseEntries(requestDraft.params);
  const headerEntries = parseEntries(requestDraft.headers);
  const bodyBytes = requestDraft.body ? new Blob([requestDraft.body]).size : 0;

  const renderRequestTab = () => {
    if (requestPanelTab === "headers") {
      return (
        <>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-200">Request headers</span>
            <textarea
              className="textarea-shell"
              onChange={(event) => updateRequestField("headers", event.target.value)}
              placeholder="Authorization: Bearer &lt;token&gt;"
              value={requestDraft.headers}
            />
          </label>

          <div className="grid gap-3">
            <DetailCard
              label="Header count"
              value={String(headerEntries.length).padStart(2, "0")}
              detail="Transport directives, auth, and content negotiation stay visible while you edit."
            />
            <div className="glass-subpanel px-4 py-4">
              <p className="text-sm font-semibold text-slate-100">Header preview</p>
              <div className="mt-4 space-y-3">
                {headerEntries.length ? (
                  headerEntries.map((entry) => (
                    <div
                      key={`${entry.key}-${entry.value}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3"
                    >
                      <span className="font-mono text-xs text-slate-200">{entry.key}</span>
                      <span className="truncate text-xs text-slate-400">{entry.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-white/10 px-3 py-4 text-sm text-slate-400">
                    No transport headers yet. Add auth or content negotiation to harden the replay.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      );
    }

    if (requestPanelTab === "params") {
      return (
        <>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-200">Query parameters</span>
            <textarea
              className="textarea-shell min-h-[240px]"
              onChange={(event) => updateRequestField("params", event.target.value)}
              placeholder={"trace=launch-readiness\nregion=shadow-us"}
              value={requestDraft.params}
            />
          </label>

          <div className="grid gap-3">
            <DetailCard
              label="Param slots"
              value={String(paramEntries.length).padStart(2, "0")}
              detail="Shape the request without cluttering the endpoint field."
            />
            <div className="glass-subpanel px-4 py-4">
              <p className="text-sm font-semibold text-slate-100">Resolved preview</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {paramEntries.length ? (
                  paramEntries.map((entry) => (
                    <span key={`${entry.key}-${entry.value}`} className="badge-neutral">
                      {entry.key}
                      <span className="text-slate-400">=</span>
                      {entry.value}
                    </span>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-white/10 px-3 py-4 text-sm text-slate-400">
                    No query params yet. Add trace labels or routing hints for the demo.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      );
    }

    if (requestPanelTab === "schema") {
      return (
        <>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-200">Contract notes and generated tests</span>
            <textarea
              className="textarea-shell min-h-[240px]"
              onChange={(event) => updateRequestField("schema", event.target.value)}
              placeholder="Add schema cues, assertions, or test scaffolding"
              value={requestDraft.schema}
            />
          </label>

          <div className="grid gap-3">
            <DetailCard
              label="Test lane"
              value="Ready"
              detail="Generate a starter contract test, then refine it before you save the request."
            />
            <div className="glass-subpanel px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Schema cues</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Keep the live demo grounded on clear pass and fail expectations.
                  </p>
                </div>
                <button className="action-chip" onClick={generateTestBlueprint} type="button">
                  <Sparkles className="h-3.5 w-3.5" />
                  Regenerate
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <p className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
                  Assert healthy status, contract shape, and latency budget so the narrative stays crisp.
                </p>
                <p className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
                  When you surface a failure, the response workspace can immediately explain the delta.
                </p>
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-200">Request body</span>
          <textarea
            className="textarea-shell"
            onChange={(event) => updateRequestField("body", event.target.value)}
            placeholder={`{\n  "message": "Send a structured payload"\n}`}
            value={requestDraft.body}
          />
        </label>

        <div className="grid gap-3">
          <DetailCard
            label="Payload size"
            value={`${bodyBytes} B`}
            detail="Tune the body in one place, then watch response size and contract behavior change downstream."
          />
          <div className="glass-subpanel px-4 py-4">
            <p className="text-sm font-semibold text-slate-100">Active sample flow</p>
            <p className="mt-2 text-lg font-semibold text-slate-50">{activePreset.label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{activePreset.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="badge-info">{selectedEnvironment}</span>
              <span className="badge-neutral">{requestDraft.method} request</span>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="glass-card relative overflow-hidden p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.16),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(45,212,191,0.12),_transparent_26%)]" />

      <div className="relative">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="surface-label">API Tester</p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-slate-50">
              Dispatch probes with <span className="text-gradient">operator-grade control</span>
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300/76">
              Build a request, switch between sample flows, generate test scaffolding, and preserve
              the strongest replay directly from the command deck.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="badge-neutral">{selectedEnvironment}</span>
            <span className={requestState.loading ? "badge-info" : "badge-good"}>
              <span className={`status-dot ${requestState.loading ? "bg-sky-300" : "bg-emerald-300"}`} />
              {requestState.loading ? "Probe in flight" : "Console armed"}
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button className="action-chip" onClick={loadNextPreset} type="button">
            <Play className="h-3.5 w-3.5" />
            Load Sample
          </button>
          <button className="action-chip" onClick={saveCurrentRequest} type="button">
            <BookmarkPlus className="h-3.5 w-3.5" />
            Save Request
          </button>
          <button className="action-chip" onClick={generateTestBlueprint} type="button">
            <Sparkles className="h-3.5 w-3.5" />
            Generate Tests
          </button>
          <button className="action-chip" onClick={exportRequestCode} type="button">
            <FileCode2 className="h-3.5 w-3.5" />
            Export Code
          </button>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-3">
          {requestPresets.map((preset, index) => {
            const isActive = index === activePresetIndex;

            return (
              <button
                key={preset.label}
                className={`glass-subpanel hover-lift px-4 py-4 text-left ${
                  isActive ? "border-sky-300/24 bg-sky-300/10" : ""
                }`}
                onClick={() => applyPreset(preset, index)}
                type="button"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-100">{preset.label}</p>
                  <span className={isActive ? "badge-info" : "badge-neutral"}>{preset.method}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{preset.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 glass-subpanel px-4 py-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="flex flex-wrap gap-2 xl:w-[34%]">
              {methods.map((method) => {
                const isActive = requestDraft.method === method;

                return (
                  <button
                    key={method}
                    className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? methodToneClasses[method]
                        : "border-white/10 bg-white/[0.05] text-slate-300 hover:border-white/16 hover:text-slate-100"
                    }`}
                    onClick={() => updateRequestField("method", method)}
                    type="button"
                  >
                    {method}
                  </button>
                );
              })}
            </div>

            <input
              className="input-shell flex-1"
              onChange={(event) => updateRequestField("url", event.target.value)}
              placeholder="https://api.your-company.dev/v1/health"
              type="url"
              value={requestDraft.url}
            />

            <motion.button
              className="button-primary h-12 shrink-0 px-6"
              disabled={requestState.loading}
              onClick={sendRequest}
              type="button"
              whileTap={{ scale: 0.98 }}
            >
              <SendHorizonal className="mr-2 h-4 w-4" />
              {requestState.loading ? "Dispatching" : "Dispatch Probe"}
            </motion.button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {requestTabs.map((tab) => (
            <button
              key={tab.id}
              className={`pill-tab ${requestPanelTab === tab.id ? "pill-tab-active" : ""}`}
              onClick={() => setRequestPanelTab(tab.id)}
              type="button"
            >
              {tab.label}
              <span className="ml-2 text-xs text-slate-500">{tab.detail}</span>
            </button>
          ))}
        </div>

        <motion.div
          key={requestPanelTab}
          className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderRequestTab()}
        </motion.div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <DetailCard
            label="Headers"
            value={String(headerEntries.length).padStart(2, "0")}
            detail="Visible transport rules keep auth and content negotiation from becoming hidden state."
          />
          <DetailCard
            label="Params"
            value={String(paramEntries.length).padStart(2, "0")}
            detail="Routing hints and trace labels are editable without crowding the endpoint field."
          />
          <DetailCard
            label="Schema lane"
            value={requestDraft.schema ? "Primed" : "Empty"}
            detail="Contract notes and generated tests stay next to the live request, not in a separate doc."
          />
        </div>
      </div>
    </div>
  );
}

export default RequestComposer;
