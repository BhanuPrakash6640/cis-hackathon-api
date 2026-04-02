function parseHeaders(headerBlock) {
  return headerBlock
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((accumulator, line) => {
      const separatorIndex = line.indexOf(":");

      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();

      if (key) {
        accumulator[key] = value;
      }

      return accumulator;
    }, {});
}

async function readResponseBody(response) {
  const contentType = response.headers.get("content-type") || "text/plain";

  if (contentType.includes("application/json")) {
    const payload = await response.json();

    return {
      contentType,
      rawBody: JSON.stringify(payload, null, 2),
    };
  }

  const payload = await response.text();

  return {
    contentType,
    rawBody: payload,
  };
}

export async function runRequest(requestDraft) {
  const startedAt = performance.now();
  const headers = parseHeaders(requestDraft.headers);
  const requestInit = {
    method: requestDraft.method,
    headers,
  };

  if (!["GET", "HEAD"].includes(requestDraft.method) && requestDraft.body.trim()) {
    requestInit.body = requestDraft.body;
  }

  const response = await fetch(requestDraft.url, requestInit);
  const { contentType, rawBody } = await readResponseBody(response);
  const duration = Math.round(performance.now() - startedAt);
  const responseHeaders = Array.from(response.headers.entries()).map(([key, value]) => ({
    key,
    value,
  }));

  return {
    body: rawBody,
    contentType,
    duration,
    headers: responseHeaders,
    ok: response.ok,
    size: new Blob([rawBody]).size,
    status: response.status,
    statusText: response.statusText,
    url: requestDraft.url,
  };
}
