class MetricsCollector {
  constructor() {
    this.snapshot = {};
  }

  setTTFA(ttfaMs) {
    this.snapshot.ttfaMs = ttfaMs;
  }

  setConsoleErrors(count) {
    this.snapshot.numberOfConsoleErrors = count;
  }

  setNetworkCalls(count) {
    this.snapshot.numberOfNetworkCalls = count;
  }

  finalize(totalTestDurationMs) {
    this.snapshot.totalTestDurationMs = totalTestDurationMs;
    return { ...this.snapshot };
  }
}

module.exports = { MetricsCollector };
