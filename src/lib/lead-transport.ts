export function createLeadTransport({
  demo,
  endpoint,
  timeoutMs = 12000,
  fetcher = fetch,
}: {
  demo: boolean;
  endpoint?: string;
  timeoutMs?: number;
  fetcher?: typeof fetch;
}) {
  return async (payload: object, honeypot = ""): Promise<{ demo: boolean }> => {
    if (demo || honeypot) {
      await new Promise((resolve) => setTimeout(resolve, 850));
      return { demo: true };
    }
    if (!endpoint || !/^https:\/\//.test(endpoint))
      throw new Error("No secure delivery endpoint configured");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetcher(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Lead delivery failed");
      return { demo: false };
    } finally {
      clearTimeout(timeout);
    }
  };
}
