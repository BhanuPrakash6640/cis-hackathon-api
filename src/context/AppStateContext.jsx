import {
  createContext,
  startTransition,
  useContext,
  useDeferredValue,
  useState,
} from "react";
import {
  aggregateSeed,
  initialCollections,
  initialHistory,
  initialRequestDraft,
  requestPresets,
} from "../data/dashboardData";
import { runRequest } from "../api/requestClient";

const AppStateContext = createContext(null);

function matchesSearchQuery(value, query) {
  if (!query) {
    return true;
  }

  return value.toLowerCase().includes(query.toLowerCase());
}

function parseHeaderBlock(headerBlock) {
  return headerBlock
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((headers, line) => {
      const separatorIndex = line.indexOf(":");

      if (separatorIndex === -1) {
        return headers;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();

      if (!key) {
        return headers;
      }

      return {
        ...headers,
        [key]: value,
      };
    }, {});
}

function parseParamsBlock(paramsBlock) {
  return paramsBlock
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((entries, line) => {
      const separatorIndex = line.includes("=") ? line.indexOf("=") : line.indexOf(":");

      if (separatorIndex === -1) {
        return entries;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();

      if (!key) {
        return entries;
      }

      return {
        ...entries,
        [key]: value,
      };
    }, {});
}

function buildEffectiveUrl(url, paramsBlock) {
  if (!paramsBlock.trim()) {
    return url;
  }

  try {
    const nextUrl = new URL(url);
    const nextParams = parseParamsBlock(paramsBlock);

    nextUrl.search = "";

    Object.entries(nextParams).forEach(([key, value]) => {
      nextUrl.searchParams.set(key, value);
    });

    return nextUrl.toString();
  } catch {
    return url;
  }
}

function buildTraceId() {
  return `PF-${Date.now().toString().slice(-6)}`;
}

function buildTimestampLabel() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function createHistoryEntry({ requestDraft, response, error }) {
  const endpoint = response?.url ?? buildEffectiveUrl(requestDraft.url, requestDraft.params);

  return {
    id: `req-${Date.now()}`,
    traceId: buildTraceId(),
    method: requestDraft.method,
    endpoint,
    status: response?.status ?? 0,
    duration: response?.duration ?? 0,
    environment: "Prod Shadow",
    timestamp: buildTimestampLabel(),
    source: "Request runner",
    responseSize: response?.size ?? 0,
    errorMessage: error?.message,
  };
}

function deriveDebuggerInsights(response, error) {
  if (error) {
    return [
      {
        title: "Request failed before a response came back",
        severity: "High",
        detail:
          "The request never resolved into an HTTP response. Check the URL, CORS rules, local API availability, or TLS setup before retrying.",
      },
      {
        title: "Next step",
        severity: "Action",
        detail:
          "Run a known-good request first, then compare the URL, auth headers, and origin policy against the failing route.",
      },
    ];
  }

  if (!response) {
    return [
      {
        title: "Response panel is waiting",
        severity: "Standby",
        detail:
          "Run a request to populate the payload, timing, diff, and diagnosis tabs.",
      },
    ];
  }

  const insights = [];

  if (response.status >= 500) {
    insights.push({
      title: "Server-side error",
      severity: "High",
      detail:
        "The service returned a 5xx response. Compare the same route in staging first, then inspect upstream dependencies and timeout settings.",
    });
  }

  if (response.status === 401 || response.status === 403) {
    insights.push({
      title: "Credential or scope mismatch",
      severity: "Medium",
      detail:
        "The response suggests missing or invalid credentials. Verify bearer tokens, scopes, and cookie propagation before retrying.",
    });
  }

  if (response.duration > 900) {
    insights.push({
      title: "Slow response",
      severity: "Medium",
      detail:
        "Response time exceeded the target. Cache misses, fan-out calls, or degraded upstreams are the likely causes.",
    });
  }

  if (!response.contentType.includes("application/json")) {
    insights.push({
      title: "Payload format needs a quick check",
      severity: "Low",
      detail:
        "The server did not return JSON. Confirm `Accept` headers and verify whether this route intentionally serves plain text or HTML.",
    });
  }

  if (!insights.length) {
    insights.push({
      title: "Healthy response",
      severity: "Info",
      detail:
        "Status, latency, and payload shape all look healthy. Save this request if you want a clean baseline for future checks.",
    });
  }

  return insights;
}

function buildTestBlueprint(requestDraft) {
  const effectiveUrl = buildEffectiveUrl(requestDraft.url, requestDraft.params);
  const bodySection =
    !["GET", "HEAD"].includes(requestDraft.method) && requestDraft.body.trim()
      ? `,\n      body: JSON.stringify(${requestDraft.body})`
      : "";

  return `describe("${requestDraft.method} ${effectiveUrl}", () => {
  it("holds the happy-path contract", async () => {
    const response = await fetch("${effectiveUrl}", {
      method: "${requestDraft.method}",
      headers: ${JSON.stringify(parseHeaderBlock(requestDraft.headers), null, 2)}${bodySection}
    });

    expect(response.status).toBeLessThan(500);
    expect(response.headers.get("content-type")).toBeTruthy();
  });
});

// Suggested operator note:
// Add auth, schema shape, and latency budget assertions before merge.`;
}

function buildFetchSnippet(requestDraft) {
  const effectiveUrl = buildEffectiveUrl(requestDraft.url, requestDraft.params);
  const headers = parseHeaderBlock(requestDraft.headers);
  const lines = [
    `const response = await fetch("${effectiveUrl}", {`,
    `  method: "${requestDraft.method}",`,
    `  headers: ${JSON.stringify(headers, null, 2).replace(/\n/g, "\n  ")},`,
  ];

  if (!["GET", "HEAD"].includes(requestDraft.method) && requestDraft.body.trim()) {
    lines.push(`  body: JSON.stringify(${requestDraft.body}),`);
  }

  lines.push("});");
  lines.push("");
  lines.push("const payload = await response.text();");
  lines.push("console.log({ status: response.status, payload });");

  return lines.join("\n");
}

function copyToClipboard(value) {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return;
  }

  navigator.clipboard.writeText(value).catch(() => {});
}

export function AppStateProvider({ children }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [requestDraft, setRequestDraft] = useState(initialRequestDraft);
  const [requestPanelTab, setRequestPanelTab] = useState("body");
  const [requestState, setRequestState] = useState({
    error: null,
    loading: false,
  });
  const [response, setResponse] = useState(null);
  const [responseTab, setResponseTab] = useState("response");
  const [history, setHistory] = useState(initialHistory);
  const [collections, setCollections] = useState(initialCollections);
  const [demoMode, setDemoMode] = useState(true);
  const [selectedEnvironment] = useState("Prod Shadow");
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const updateRequestField = (field, value) => {
    setRequestDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const applyPreset = (preset, presetIndex) => {
    setRequestDraft({
      method: preset.method,
      url: preset.url,
      headers: preset.headers,
      body: preset.body,
      params: preset.params,
      schema: preset.schema,
    });
    setRequestPanelTab("body");

    if (typeof presetIndex === "number") {
      setActivePresetIndex(presetIndex);
    }
  };

  const loadNextPreset = () => {
    const nextIndex = (activePresetIndex + 1) % requestPresets.length;

    applyPreset(requestPresets[nextIndex], nextIndex);
  };

  const generateTestBlueprint = () => {
    setRequestDraft((current) => ({
      ...current,
      schema: buildTestBlueprint(current),
    }));
    setRequestPanelTab("schema");
  };

  const exportRequestCode = () => {
    copyToClipboard(buildFetchSnippet(requestDraft));
  };

  const sendRequest = async () => {
    setRequestState({
      error: null,
      loading: true,
    });

    try {
      const effectiveRequest = {
        ...requestDraft,
        url: buildEffectiveUrl(requestDraft.url, requestDraft.params),
      };
      const result = await runRequest(effectiveRequest);
      setResponse(result);
      setResponseTab("response");

      startTransition(() => {
        setHistory((current) =>
          [createHistoryEntry({ requestDraft, response: result }), ...current].slice(0, 16),
        );
      });

      setRequestState({
        error: null,
        loading: false,
      });
    } catch (error) {
      setResponse(null);

      startTransition(() => {
        setHistory((current) => [createHistoryEntry({ error, requestDraft }), ...current].slice(0, 16));
      });

      setRequestState({
        error,
        loading: false,
      });
      setResponseTab("diagnosis");
    }
  };

  const saveCurrentRequest = () => {
    startTransition(() => {
      setCollections((current) => {
        const scratchpad = current.find((collection) => collection.id === "col-scratchpad");

        if (!scratchpad) {
          return [
            {
              id: "col-scratchpad",
              name: "Saved This Session",
              owner: "You",
              requestCount: 1,
              description: "Requests saved from the runner while testing or debugging.",
              lastUpdated: "Just now",
              tags: ["saved", "manual"],
            },
            ...current,
          ];
        }

        return current.map((collection) =>
          collection.id === "col-scratchpad"
            ? {
                ...collection,
                requestCount: collection.requestCount + 1,
                lastUpdated: "Just now",
              }
            : collection,
        );
      });
    });
  };

  const filteredHistory = history.filter((item) =>
    matchesSearchQuery(
      `${item.traceId} ${item.method} ${item.endpoint} ${item.status} ${item.environment} ${item.source}`,
      deferredSearchQuery,
    ),
  );

  const filteredCollections = collections.filter((collection) =>
    matchesSearchQuery(
      `${collection.name} ${collection.owner} ${collection.description} ${collection.tags.join(" ")}`,
      deferredSearchQuery,
    ),
  );

  const successfulHistoryCount = history.filter((item) => item.status > 0 && item.status < 400).length;
  const totalRequests = aggregateSeed.totalRequests + history.length;
  const averageResponseTime =
    (aggregateSeed.totalLatency + history.reduce((sum, item) => sum + item.duration, 0)) / totalRequests;
  const successRate = ((aggregateSeed.successfulRequests + successfulHistoryCount) / totalRequests) * 100;
  const activeAlerts =
    aggregateSeed.alertCount + history.filter((item) => item.status === 0 || item.status >= 400).length;
  const slowEndpointCount =
    aggregateSeed.slowEndpoints + history.filter((item) => item.duration >= 850).length;
  const slowestHistoryEntry = history.reduce(
    (slowest, item) => (item.duration > slowest.duration ? item : slowest),
    {
      endpoint: aggregateSeed.slowestEndpoint.endpoint,
      duration: aggregateSeed.slowestEndpoint.duration,
    },
  );
  const readinessScore = Math.min(
    99,
    Math.max(
      71,
      Math.round(
        successRate * 0.74 +
          Math.max(0, 14 - activeAlerts) * 1.7 +
          Math.max(0, 9 - slowEndpointCount) * 1.8,
      ),
    ),
  );
  const recentFailures = history.filter((item) => item.status === 0 || item.status >= 400).slice(0, 4);
  const latestSuccessfulRequest = history.find((item) => item.status > 0 && item.status < 400) ?? null;
  const debuggerInsights = deriveDebuggerInsights(response, requestState.error);

  const value = {
    activeAlerts,
    activePresetIndex,
    activeSection,
    applyPreset,
    averageResponseTime,
    collections,
    debuggerInsights,
    demoMode,
    exportRequestCode,
    filteredCollections,
    filteredHistory,
    generateTestBlueprint,
    history,
    latestSuccessfulRequest,
    loadNextPreset,
    readinessScore,
    recentFailures,
    requestDraft,
    requestPanelTab,
    requestPresets,
    requestState,
    response,
    responseTab,
    saveCurrentRequest,
    searchQuery,
    selectedEnvironment,
    setActiveSection,
    setDemoMode,
    setRequestPanelTab,
    setResponseTab,
    setSearchQuery,
    sendRequest,
    slowEndpointCount,
    slowestHistoryEntry,
    successRate,
    toggleDemoMode: () => setDemoMode((current) => !current),
    totalRequests,
    updateRequestField,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used inside AppStateProvider.");
  }

  return context;
}
