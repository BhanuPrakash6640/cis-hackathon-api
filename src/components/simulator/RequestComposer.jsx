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
  const bodyBytes = requestDraft.body ? new Blob([requestDraft.body]).size : 0;

  const renderRequestBody = () => {
    return (
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-200">Request body</span>
        <textarea
          className="textarea-shell min-h-[320px]"
          onChange={(event) => updateRequestField("body", event.target.value)}
          placeholder={`{\n  "message": "Send a structured payload"\n}`}
          value={requestDraft.body}
        />
      </label>
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


        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderRequestBody()}
        </motion.div>
      </div>
    </div>
  );
}

export default RequestComposer;
