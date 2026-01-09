export type MetricsSnapshot = {
  ttfaMs?: number;
  totalTestDurationMs?: number;
  numberOfConsoleErrors?: number;
  numberOfNetworkCalls?: number;
};

export class MetricsCollector {
  private snapshot: MetricsSnapshot = {};

  setTTFA(ttfaMs: number) {
    this.snapshot.ttfaMs = ttfaMs;
  }

  setConsoleErrors(count: number) {
    this.snapshot.numberOfConsoleErrors = count;
  }

  setNetworkCalls(count: number) {
    this.snapshot.numberOfNetworkCalls = count;
  }

  finalize(totalTestDurationMs: number) {
    this.snapshot.totalTestDurationMs = totalTestDurationMs;
    return { ...this.snapshot };
  }
}
