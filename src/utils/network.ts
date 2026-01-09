import { Page, expect } from "@playwright/test";

export type NetworkRecord = {
  url: string;
  method: string;
  status?: number;
  requestBody?: unknown;
  responseBody?: unknown;
};

export type NetworkRecorder = {
  records: NetworkRecord[];
  summary: () => { total: number; endpoints: Record<string, number> };
};

type RecorderOptions = {
  maxRecords?: number;
  maxBodySize?: number;
};

const truncate = (value: string, maxSize: number) => {
  if (value.length <= maxSize) return value;
  return `${value.slice(0, maxSize)}...truncated`;
};

const clampBody = (body: unknown, maxSize: number) => {
  if (body === undefined) return undefined;
  if (typeof body === "string") return truncate(body, maxSize);
  try {
    const serialized = JSON.stringify(body);
    return truncate(serialized, maxSize);
  } catch {
    return "[unserializable]";
  }
};

export const createNetworkRecorder = (page: Page, options: RecorderOptions = {}): NetworkRecorder => {
  const { maxRecords = 200, maxBodySize = 1000 } = options;
  const records: NetworkRecord[] = [];

  page.on("request", (request) => {
    const entry: NetworkRecord = {
      url: request.url(),
      method: request.method()
    };

    try {
      entry.requestBody = request.postDataJSON();
    } catch {
      entry.requestBody = request.postData();
    }

    if (records.length < maxRecords) {
      entry.requestBody = clampBody(entry.requestBody, maxBodySize);
      records.push(entry);
    }
  });

  page.on("response", async (response) => {
    const url = response.url();
    const record = records.find((entry) => entry.url === url && entry.status === undefined);
    if (!record) return;
    record.status = response.status();
    try {
      record.responseBody = clampBody(await response.json(), maxBodySize);
    } catch {
      record.responseBody = undefined;
    }
  });

  return {
    records,
    summary: () => {
      return records.reduce(
        (acc, record) => {
          const key = record.url.replace(/\?.*$/, "");
          acc.endpoints[key] = (acc.endpoints[key] || 0) + 1;
          acc.total += 1;
          return acc;
        },
        { total: 0, endpoints: {} as Record<string, number> }
      );
    }
  };
};

export const expectPlaybackSessionCall = async (recorder: NetworkRecorder) => {
  await expect
    .poll(() => recorder.records.some((r) => r.url.includes("/playback/session")), { timeout: 5000 })
    .toBeTruthy();
};

export const expectEventCallWithType = async (recorder: NetworkRecorder, eventType: string) => {
  await expect
    .poll(
      () =>
        recorder.records.some((r) => {
          if (!r.url.includes("/events")) return false;
          let body: { type?: string } | undefined;
          if (typeof r.requestBody === "string") {
            try {
              body = JSON.parse(r.requestBody);
            } catch {
              body = undefined;
            }
          } else {
            body = r.requestBody as { type?: string } | undefined;
          }
          return body?.type === eventType;
        }),
      { timeout: 5000 }
    )
    .toBeTruthy();
};
