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
  { id: "body", label: "Body", detail: "Payload" },
  { id: "headers", label: "Headers", detail: "Request headers" },
  { id: "params", label: "Params", detail: "Query string" },
  { id: "schema", label: "Notes", detail: "Checks and tests" },
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
              detail="Keep auth and content type visible while you edit."
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
                    No headers yet. Add auth or content type if this route needs them.
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
              placeholder={"source=dashboard\nregion=shadow-us"}
              value={requestDraft.params}
            />
          </label>

          <div className="grid gap-3">
            <DetailCard
              label="Param slots"
              value={String(paramEntries.length).padStart(2, "0")}
              detail="Add query values without cramming them into the URL field."
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
                    No query params yet. Add filters, IDs, or routing hints if you need them.
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
            <span className="text-sm font-semibold text-slate-200">Notes and test stub</span>
            <textarea
              className="textarea-shell min-h-[240px]"
              onChange={(event) => updateRequestField("schema", event.target.value)}
              placeholder="Add checks, assumptions, or a small test stub"
              value={requestDraft.schema}
            />
          </label>

          <div className="grid gap-3">
            <DetailCard
              label="Test lane"
              value="Ready"
              detail="Generate a starter test, then edit the expectations before you save the request."
            />
            <div className="glass-subpanel px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Checks to keep in mind</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Write down what should pass, fail, or stay stable for this route.
                  </p>
                </div>
                <button className="action-chip" onClick={generateTestBlueprint} type="button">
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate again
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <p className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
                  Check the status code, content type, and any fields that should always be present.
                </p>
                <p className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
                  If the request fails, this tab gives you a place to record what changed and what to verify next.
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
            detail="Useful when you want to compare request size against the response that comes back."
          />
          <div className="glass-subpanel px-4 py-4">
            <p className="text-sm font-semibold text-slate-100">Current example</p>
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
              {requestState.loading ? "Sending" : "Send request"}
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
            detail="Quick count of the headers attached to the current request."
          />
          <DetailCard
            label="Params"
            value={String(paramEntries.length).padStart(2, "0")}
            detail="Keeps query values visible without crowding the URL field."
          />
          <DetailCard
            label="Notes"
            value={requestDraft.schema ? "Primed" : "Empty"}
            detail="Place for checks, assumptions, or the generated test stub."
          />
        </div>
      </div>
    </div>
  );
}

export default RequestComposer;
