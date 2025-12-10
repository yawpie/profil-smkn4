const API_BASE_URL = "http://localhost:3001";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiError {
  status: number;
  message: string;
}

export async function apiRequest<T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers ?? {}),
    },
    // Include credentials so backend HTTP-only cookies (access/refresh tokens)
    // are automatically sent with every request, even across origins.
    credentials: "include",
    body: options.body
      ? isFormData
        ? (options.body as FormData)
        : JSON.stringify(options.body)
      : undefined,
  });

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    // ignore JSON parse errors; backend might return empty body
  }

  if (!response.ok) {
    let message = "Unknown error";
    if (data && typeof data === "object" && "message" in data) {
      const raw = (data as { message?: unknown }).message;
      if (typeof raw === "string") {
        message = raw;
      } else if (raw != null) {
        message = JSON.stringify(raw);
      }
    } else if (response.statusText) {
      message = response.statusText;
    }

    const error: ApiError = { status: response.status, message };
    throw error;
  }

  return data as T;
}

// Convenience helpers for common verbs
export const apiGet = <T>(path: string) =>
  apiRequest<T>(path, { method: "GET" });

export const apiPost = <TResponse, TBody = unknown>(
  path: string,
  body: TBody
) => apiRequest<TResponse>(path, { method: "POST", body });

export const apiPut = <TResponse, TBody = unknown>(path: string, body: TBody) =>
  apiRequest<TResponse>(path, { method: "PUT", body });

export const apiDelete = <TResponse>(path: string) =>
  apiRequest<TResponse>(path, { method: "DELETE" });
