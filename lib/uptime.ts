export interface CheckResult {
  isUp: boolean;
  statusCode: number | null;
  responseTime: number | null;
  error: string | null;
}

export async function performCheck(url: string): Promise<CheckResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const start = Date.now();

  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "DashboardUptimeMonitor/1.0",
      },
    });

    const responseTime = Date.now() - start;
    const isUp = response.status >= 200 && response.status < 400;

    return {
      isUp,
      statusCode: response.status,
      responseTime,
      error: isUp ? null : `HTTP ${response.status}`,
    };
  } catch (err) {
    const responseTime = Date.now() - start;
    const error =
      err instanceof Error
        ? err.name === "AbortError"
          ? "Timeout (10s)"
          : err.message
        : "Erreur inconnue";

    return {
      isUp: false,
      statusCode: null,
      responseTime,
      error,
    };
  } finally {
    clearTimeout(timeout);
  }
}
