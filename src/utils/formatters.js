export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDuration(value) {
  return `${Math.round(value)} ms`;
}

export function formatPercent(value) {
  return `${value.toFixed(1)}%`;
}

export function formatBytes(value) {
  if (!value) {
    return "0 B";
  }

  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export function getStatusTone(status) {
  if (status >= 500) {
    return "rose";
  }

  if (status >= 400) {
    return "amber";
  }

  if (status >= 300) {
    return "sky";
  }

  return "emerald";
}

export function getMethodTone(method) {
  const methodMap = {
    GET: "sky",
    POST: "emerald",
    PUT: "violet",
    PATCH: "amber",
    DELETE: "rose",
  };

  return methodMap[method] ?? "slate";
}
