type ErrorReportOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

/**
 * Reports errors caught by React error boundaries (and other manual call sites).
 * Currently logs to the console; swap this out for your own error-tracking
 * service (Sentry, Bugsnag, a custom endpoint, etc.) as needed.
 */
export function reportError(
  error: unknown,
  context: Record<string, unknown> = {},
  options: ErrorReportOptions = {},
) {
  const route = typeof window !== "undefined" ? window.location.pathname : undefined;
  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);

  console.error("[error-report]", {
    message,
    stack: error instanceof Error ? error.stack : undefined,
    route,
    mechanism: options.mechanism ?? "manual",
    severity: options.severity ?? "error",
    ...context,
  });
}
