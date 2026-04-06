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
    description: "Project snapshot",
  },
  {
    id: "api-tester",
    label: "API Tester",
    icon: Send,
    description: "Run requests",
  },
  {
    id: "replay-console",
    label: "Response",
    icon: SquareTerminal,
    description: "Inspect responses",
  },
  {
    id: "pulse-monitor",
    label: "Traffic",
    icon: Radar,
    description: "Recent activity",
  },
];

export const heroStatusPills = [
  {
    label: "Schema checks",
    value: "On",
    tone: "cyan",
    icon: Braces,
  },
  {
    label: "Open issues",
    value: "3",
    tone: "amber",
    icon: TriangleAlert,
  },
];

export const heroMiniMetrics = [
  {
    title: "Saved requests",
    value: "39",
    detail: "Starter requests cover health, auth, checkout, and recovery paths.",
  },
  {
    title: "Core flow coverage",
    value: "92%",
    detail: "Most of the seed data sits on the routes people actually test and debug.",
  },
  {
    title: "Useful views",
    value: "4",
    detail: "Build, inspect, compare, and scan recent failures without leaving the page.",
  },
];

export const kpiDefinitions = [
  {
    id: "total-requests",
    label: "Requests",
    icon: DatabaseZap,
    accent: "cyan",
    footnote: "Seed data plus this session",
  },
  {
    id: "success-rate",
    label: "Success Rate",
    icon: ShieldCheck,
    accent: "emerald",
    footnote: "2xx and 3xx responses",
  },
  {
    id: "average-response",
    label: "Avg Latency",
    icon: Gauge,
    accent: "sky",
    footnote: "Across seeded and live traffic",
  },
  {
    id: "active-alerts",
    label: "Open Issues",
    icon: TriangleAlert,
    accent: "rose",
    footnote: "Failures and risky responses",
  },
  {
    id: "slow-endpoints",
    label: "Slow Routes",
    icon: Waypoints,
    accent: "amber",
    footnote: "Requests above the slow threshold",
  },
  {
    id: "readiness-score",
    label: "Health Score",
    icon: Sparkles,
    accent: "violet",
    footnote: "Simple snapshot of session health",
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
    coverage: "Auth, quota, request routing",
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
    title: "Checkout auth drift",
    time: "2 minutes ago",
    detail: "401 responses increased after the latest token refresh change in prod shadow.",
    severity: "High",
    owner: "Identity",
    action: "Run the auth checks",
  },
  {
    title: "Checkout latency is climbing",
    time: "11 minutes ago",
    detail: "The checkout aggregation route stayed above the 300 ms target for three windows.",
    severity: "Medium",
    owner: "Platform",
    action: "Open the timing view",
  },
  {
    title: "Receipt payload changed",
    time: "23 minutes ago",
    detail: "The receipts response changed shape after the latest payload expansion.",
    severity: "Info",
    owner: "Insight",
    action: "Check the diff tab",
  },
];

export const requestPresets = [
  {
    label: "Health Check",
    description: "Quick healthy request for a fast baseline.",
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    headers: "Accept: application/json",
    body: "",
    params: "view=baseline\nregion=shadow-us",
    schema:
      "GET /posts/1\n- Expect 200 OK\n- Confirm the response stays JSON\n- Use this result as the baseline for comparisons",
  },
  {
    label: "Create Record",
    description: "POST example with a small JSON body.",
    method: "POST",
    url: "https://jsonplaceholder.typicode.com/posts",
    headers: "Accept: application/json\nContent-Type: application/json",
    body: '{\n  "title": "Latency regression",\n  "body": "Example request from the dashboard",\n  "userId": 42\n}',
    params: "source=dashboard\nmode=create",
    schema:
      "POST /posts\n- Expect 201 Created\n- Confirm title, body, and userId come back in the payload\n- Use this request to show body editing and response review",
  },
  {
    label: "401 Example",
    description: "Small failing request for auth and error handling.",
    method: "GET",
    url: "https://httpstat.us/401",
    headers: "Accept: text/plain",
    body: "",
    params: "retry=0\nsource=issues",
    schema:
      "GET /401\n- Expect 401 Unauthorized\n- Confirm the diagnosis points to credentials or permissions\n- Compare it against the healthy baseline request",
  },
  {
    label: "Product Search",
    description: "Search request with multiple query parameters.",
    method: "GET",
    url: "https://dummyjson.com/products/search",
    headers: "Accept: application/json",
    body: "",
    params: "q=phone\nlimit=5\nskip=0",
    schema:
      "GET /products/search\n- Expect 200 OK\n- Confirm results array contains phone-related items\n- Use this to test query parameter parsing and list rendering",
  },
  {
    label: "Update Profile",
    description: "PUT request with nested JSON data.",
    method: "PUT",
    url: "https://reqres.in/api/users/2",
    headers: "Content-Type: application/json",
    body: '{\n  "name": "Arjun tech",\n  "job": "Lead Engineer",\n  "metadata": {\n    "focus": "Security",\n    "active": true\n  }\n}',
    params: "source=admin\nnotify=true",
    schema:
      "PUT /users/2\n- Expect 200 OK\n- Confirm the updated timestamp and name reflections\n- Use this to test nested JSON editing and PUT method handling",
  },
  {
    label: "Auth Token",
    description: "Secure POST for token exchange.",
    method: "POST",
    url: "https://api.internal.dev/v1/auth/token",
    headers: "Content-Type: application/x-www-form-urlencoded\nAuthorization: Basic dGVzdC1jbGllbnQ6dGVzdC1zZWNyZXQ=",
    body: "grant_type=client_credentials&scope=read:all",
    params: "",
    schema:
      "POST /auth/token\n- Expect 200 OK or 201 Created\n- Confirm access_token and expires_in fields\n- Use this for testing basic auth headers and form-encoded bodies",
  },
  {
    label: "Sync Legacy",
    description: "POST with XML payload for legacy testing.",
    method: "POST",
    url: "https://api.acme.dev/sync/xml",
    headers: "Content-Type: application/xml\nAccept: application/xml",
    body: '<?xml version="1.0" encoding="UTF-8"?>\n<sync>\n  <id>7102</id>\n  <status>pending</status>\n</sync>',
    params: "version=1.0",
    schema:
      "POST /sync/xml\n- Expect 200 OK\n- Confirm XML response parsing\n- Use this to test non-JSON content types and legacy integrations",
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
    environment: "Live",
    timestamp: "2 min ago",
    source: "Saved request",
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
    source: "Manual run",
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
    source: "Cleanup script",
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
    source: "Dashboard",
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
    source: "Saved request",
    responseSize: 1430,
  },
  {
    id: "req-7097",
    traceId: "PF-7097",
    method: "GET",
    endpoint: "https://api.internal.dev/receipts/912",
    status: 401,
    duration: 198,
    environment: "Live",
    timestamp: "79 min ago",
    source: "Status check",
    responseSize: 92,
    errorMessage: "Token scope mismatch on receipt read path.",
  },
];

export const initialCollections = [
  {
    id: "col-1",
    name: "Checkout Baseline",
    owner: "Platform Team",
    requestCount: 18,
    description: "A small set of requests for payments, tax, and receipts before a release.",
    lastUpdated: "5 minutes ago",
    tags: ["payments", "critical-path"],
  },
  {
    id: "col-2",
    name: "Auth Checks",
    owner: "Identity",
    requestCount: 9,
    description: "Covers refresh tokens, missing scopes, and a few common auth failures.",
    lastUpdated: "22 minutes ago",
    tags: ["auth", "security"],
  },
  {
    id: "col-3",
    name: "Edge Routing",
    owner: "Infra",
    requestCount: 12,
    description: "Checks headers, region routing, and a couple of failover scenarios.",
    lastUpdated: "1 hour ago",
    tags: ["routing", "edge"],
  },
  {
    id: "col-4",
    name: "Support Recovery",
    owner: "CX Ops",
    requestCount: 7,
    description: "Useful requests for order recovery, refunds, and notification checks.",
    lastUpdated: "2 hours ago",
    tags: ["ops", "recovery"],
  },
];

export const settingsCards = [
  {
    title: "View Mode",
    value: "Working Session",
    detail: "Keeps the layout focused on requests, responses, and recent issues.",
    icon: Command,
  },
  {
    title: "Environment",
    value: "Prod Shadow",
    detail: "Live requests use a safe shadow target while still feeling realistic.",
    icon: RadioTower,
  },
  {
    title: "Issue Sorting",
    value: "Auto Ranked",
    detail: "Recent failures and slower responses are surfaced without extra setup.",
    icon: BellRing,
  },
  {
    title: "Saved Requests",
    value: "Collections First",
    detail: "Reusable request groups stay close to the runner instead of getting buried in a menu.",
    icon: Rows3,
  },
];

export const insightPlaybook = [
  {
    title: "Start with a healthy request",
    detail: "Run Health Check first so the response and timing tabs have a clean baseline.",
    icon: ShieldCheck,
  },
  {
    title: "Run one failing example",
    detail: "Use 401 Example or Create Record to show how the page handles errors and changed payloads.",
    icon: Siren,
  },
  {
    title: "Finish in traffic and saved requests",
    detail: "Use the activity and collections sections to show that the tool is useful beyond one request.",
    icon: ChartColumn,
  },
];

export const commandDeckHighlights = [
  {
    title: "Run real requests",
    detail: "Start with a sample request or type your own URL and headers.",
    icon: Send,
  },
  {
    title: "Scan recent traffic",
    detail: "See slow or failing requests without switching to another screen.",
    icon: Radar,
  },
  {
    title: "Compare responses",
    detail: "The response view keeps payload, timing, and a simple diff in one place.",
    icon: ScanSearch,
  },
  {
    title: "Reuse the good ones",
    detail: "Save the requests your team reaches for most often.",
    icon: Boxes,
  },
];
