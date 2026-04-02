import {
  BellRing,
  Bot,
  Boxes,
  Braces,
  ChartColumn,
  Command,
  Compass,
  DatabaseZap,
  Gauge,
  Radar,
  RadioTower,
  Rows3,
  ScanSearch,
  Send,
  Settings2,
  ShieldCheck,
  Siren,
  Sparkles,
  SquareTerminal,
  TriangleAlert,
  Waypoints,
} from "lucide-react";

export const navigationItems = [
  {
    id: "overview",
    label: "Overview",
    icon: Compass,
    description: "Command deck",
  },
  {
    id: "api-tester",
    label: "API Tester",
    icon: Send,
    description: "Dispatch probes",
  },
  {
    id: "collections",
    label: "Collections",
    icon: Boxes,
    description: "Saved workflows",
  },
  {
    id: "replay-console",
    label: "Replay Console",
    icon: SquareTerminal,
    description: "Inspect every trace",
  },
  {
    id: "pulse-monitor",
    label: "Pulse Monitor",
    icon: Radar,
    description: "Live telemetry",
  },
  {
    id: "insight-engine",
    label: "Insight Engine",
    icon: Sparkles,
    description: "Explain anomalies",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings2,
    description: "Tune the workspace",
  },
];

export const heroStatusPills = [
  {
    label: "Environment",
    value: "Prod Shadow",
    tone: "emerald",
    icon: RadioTower,
  },
  {
    label: "Schema Guard",
    value: "Watching",
    tone: "cyan",
    icon: Braces,
  },
  {
    label: "Insight Engine",
    value: "Primed",
    tone: "amber",
    icon: Bot,
  },
];

export const heroMiniMetrics = [
  {
    title: "Replay-ready flows",
    value: "39",
    detail: "Shared request packs synced across platform, auth, and payments.",
  },
  {
    title: "Critical path coverage",
    value: "92%",
    detail: "The live demo path stays anchored on health, auth, and checkout traces.",
  },
  {
    title: "Operator focus",
    value: "4 lanes",
    detail: "Test, replay, monitor, and diagnose from the same command surface.",
  },
];

export const kpiDefinitions = [
  {
    id: "total-requests",
    label: "Total Requests",
    icon: DatabaseZap,
    accent: "cyan",
    footnote: "Across prod shadow and staging replay lanes",
  },
  {
    id: "success-rate",
    label: "Success Rate",
    icon: ShieldCheck,
    accent: "emerald",
    footnote: "Healthy 2xx and 3xx outcomes",
  },
  {
    id: "average-response",
    label: "Avg Latency",
    icon: Gauge,
    accent: "sky",
    footnote: "Rolling mean across seeded and live traffic",
  },
  {
    id: "active-alerts",
    label: "Active Alerts",
    icon: TriangleAlert,
    accent: "rose",
    footnote: "Open degradations demanding operator review",
  },
  {
    id: "slow-endpoints",
    label: "Slow Endpoints",
    icon: Waypoints,
    accent: "amber",
    footnote: "Endpoints currently breaching the latency envelope",
  },
  {
    id: "readiness-score",
    label: "Readiness Score",
    icon: Sparkles,
    accent: "violet",
    footnote: "Composite launch confidence for a live stakeholder demo",
  },
];

export const aggregateSeed = {
  totalRequests: 18426,
  successfulRequests: 18092,
  totalLatency: 18426 * 286,
  alertCount: 3,
  slowEndpoints: 2,
  slowestEndpoint: {
    endpoint: "/billing/reconciliation",
    duration: 1420,
  },
};

export const trafficSeries = [
  { label: "08:00", traffic: 126, errors: 2, latency: 202 },
  { label: "10:00", traffic: 182, errors: 4, latency: 224 },
  { label: "12:00", traffic: 168, errors: 3, latency: 241 },
  { label: "14:00", traffic: 240, errors: 7, latency: 312 },
  { label: "16:00", traffic: 224, errors: 5, latency: 284 },
  { label: "18:00", traffic: 278, errors: 8, latency: 338 },
  { label: "20:00", traffic: 198, errors: 2, latency: 246 },
];

export const endpointHealth = [
  {
    name: "Gateway Mesh",
    uptime: "99.99%",
    latency: "72 ms",
    status: "Stable",
    coverage: "Auth, quota, replay routing",
  },
  {
    name: "Identity Core",
    uptime: "99.96%",
    latency: "118 ms",
    status: "Watching",
    coverage: "Refresh, scopes, token minting",
  },
  {
    name: "Checkout Engine",
    uptime: "99.94%",
    latency: "264 ms",
    status: "Load spike",
    coverage: "Tax, pricing, settlement",
  },
  {
    name: "Insight Engine",
    uptime: "99.91%",
    latency: "312 ms",
    status: "Online",
    coverage: "Anomaly ranking and suggested fixes",
  },
];

export const insightAlerts = [
  {
    title: "Checkout auth drift detected",
    time: "2 minutes ago",
    detail: "401 responses spiked after a token refresh rollout in the shadow environment.",
    severity: "High",
    owner: "Identity",
    action: "Replay auth collection",
  },
  {
    title: "P95 latency nearing guardrail",
    time: "11 minutes ago",
    detail: "The checkout aggregation path crossed the 300 ms budget for three consecutive windows.",
    severity: "Medium",
    owner: "Platform",
    action: "Inspect replay timeline",
  },
  {
    title: "Schema hint generated",
    time: "23 minutes ago",
    detail: "The response contract for receipts shifted shape after the latest payload expansion.",
    severity: "Info",
    owner: "Insight",
    action: "Open diff workspace",
  },
];

export const requestPresets = [
  {
    label: "Health Probe",
    description: "Establish a healthy baseline with a fast JSON response.",
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    headers: "Accept: application/json",
    body: "",
    params: "trace=health-probe\nregion=shadow-us",
    schema:
      "GET /posts/1\n- Expect 200 OK\n- Verify JSON payload structure remains stable\n- Capture latency for baseline comparison",
  },
  {
    label: "Incident Replay",
    description: "Post a synthetic incident payload to demonstrate request mutation.",
    method: "POST",
    url: "https://jsonplaceholder.typicode.com/posts",
    headers: "Accept: application/json\nContent-Type: application/json",
    body: '{\n  "title": "Latency regression",\n  "body": "Repro from CIS Hackathon",\n  "userId": 42\n}',
    params: "source=judge-demo\nmode=replay",
    schema:
      "POST /posts\n- Expect 201 Created\n- Assert `title`, `body`, and `userId` echo in the payload\n- Validate response size stays under 2 KB",
  },
  {
    label: "Auth Breaker",
    description: "Trigger a failure path to light up diagnosis and insight cards.",
    method: "GET",
    url: "https://httpstat.us/401",
    headers: "Accept: text/plain",
    body: "",
    params: "retry=0\nsource=triage",
    schema:
      "GET /401\n- Expect 401 Unauthorized\n- Confirm diagnosis panel classifies auth or permission drift\n- Recommend next-step replay flow",
  },
];

export const initialRequestDraft = {
  method: requestPresets[0].method,
  url: requestPresets[0].url,
  headers: requestPresets[0].headers,
  body: requestPresets[0].body,
  params: requestPresets[0].params,
  schema: requestPresets[0].schema,
};

export const initialHistory = [
  {
    id: "req-7102",
    traceId: "PF-7102",
    method: "GET",
    endpoint: "https://api.stripe.com/v1/customers",
    status: 200,
    duration: 184,
    environment: "Prod Shadow",
    timestamp: "2 min ago",
    source: "Collection replay",
    responseSize: 12404,
  },
  {
    id: "req-7101",
    traceId: "PF-7101",
    method: "POST",
    endpoint: "https://api.internal.dev/auth/token",
    status: 201,
    duration: 322,
    environment: "Staging",
    timestamp: "7 min ago",
    source: "Launch pipeline",
    responseSize: 816,
  },
  {
    id: "req-7100",
    traceId: "PF-7100",
    method: "DELETE",
    endpoint: "https://api.acme.dev/orders/1883",
    status: 204,
    duration: 286,
    environment: "Staging",
    timestamp: "18 min ago",
    source: "Governed replay",
    responseSize: 0,
  },
  {
    id: "req-7099",
    traceId: "PF-7099",
    method: "GET",
    endpoint: "https://api.acme.dev/reports/revenue",
    status: 504,
    duration: 1322,
    environment: "Prod",
    timestamp: "33 min ago",
    source: "Operator console",
    responseSize: 228,
    errorMessage: "Upstream analytics gateway timed out after 1.3 s.",
  },
  {
    id: "req-7098",
    traceId: "PF-7098",
    method: "PATCH",
    endpoint: "https://api.acme.dev/users/42",
    status: 200,
    duration: 410,
    environment: "QA",
    timestamp: "1 hr ago",
    source: "Collection replay",
    responseSize: 1430,
  },
  {
    id: "req-7097",
    traceId: "PF-7097",
    method: "GET",
    endpoint: "https://api.internal.dev/receipts/912",
    status: 401,
    duration: 198,
    environment: "Prod Shadow",
    timestamp: "79 min ago",
    source: "Synthetic sentinel",
    responseSize: 92,
    errorMessage: "Token scope mismatch on receipt read path.",
  },
];

export const initialCollections = [
  {
    id: "col-1",
    name: "Launch Readiness",
    owner: "Platform Team",
    requestCount: 18,
    description: "The judge-friendly golden path for payments, tax, and receipts before a release cut.",
    lastUpdated: "5 minutes ago",
    tags: ["payments", "critical-path"],
  },
  {
    id: "col-2",
    name: "Identity Hardening",
    owner: "Identity",
    requestCount: 9,
    description: "Replay refresh tokens, permission drift, and edge-case auth failures in one pass.",
    lastUpdated: "22 minutes ago",
    tags: ["auth", "security"],
  },
  {
    id: "col-3",
    name: "Edge Routing",
    owner: "Infra",
    requestCount: 12,
    description: "Validate headers, region affinity, failover, and replay consistency across edge lanes.",
    lastUpdated: "1 hour ago",
    tags: ["routing", "edge"],
  },
  {
    id: "col-4",
    name: "Support Recovery",
    owner: "CX Ops",
    requestCount: 7,
    description: "Fast replay pack for order recovery, refunds, and notification diagnostics during incidents.",
    lastUpdated: "2 hours ago",
    tags: ["ops", "recovery"],
  },
];

export const settingsCards = [
  {
    title: "Launch Mode",
    value: "Judge Demo",
    detail: "High-signal copy, seeded telemetry, and motion polish stay enabled for storytelling.",
    icon: Command,
  },
  {
    title: "Signal Routing",
    value: "Prod Shadow",
    detail: "Live requests point at safe shadow traffic while preserving realistic response profiles.",
    icon: RadioTower,
  },
  {
    title: "Alerting Stack",
    value: "AI Assisted",
    detail: "Pulse Monitor and Insight Engine stay wired together so every anomaly gets a narrative.",
    icon: BellRing,
  },
  {
    title: "Replay Density",
    value: "Collections First",
    detail: "Request packs stay ready for instant replay across auth, checkout, and operational fallbacks.",
    icon: Rows3,
  },
];

export const insightPlaybook = [
  {
    title: "Establish the baseline",
    detail: "Start with Health Probe to show a fast, healthy payload and seed the replay workspace.",
    icon: ShieldCheck,
  },
  {
    title: "Introduce the anomaly",
    detail: "Switch to Auth Breaker or Incident Replay to surface alerts, diff view, and diagnosis in one move.",
    icon: Siren,
  },
  {
    title: "Close with confidence",
    detail: "Jump into Pulse Monitor and Collections to prove the product scales from one request to fleet-wide readiness.",
    icon: ChartColumn,
  },
];

export const commandDeckHighlights = [
  {
    title: "Probe live endpoints",
    detail: "A premium console for healthy baselines, replay payloads, and controlled failure demos.",
    icon: Send,
  },
  {
    title: "Track fleet pulse",
    detail: "Endpoint health, request trends, and failure widgets keep the page dense and demo-ready.",
    icon: Radar,
  },
  {
    title: "Explain what changed",
    detail: "Insight Engine turns raw responses into crisp narrative cues for judges and operators.",
    icon: ScanSearch,
  },
  {
    title: "Package proven flows",
    detail: "Collections keep your strongest request stories one click away during a live walkthrough.",
    icon: Boxes,
  },
];
