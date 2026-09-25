"use client";

/** The message from the API if it sent one, so the UI never says "Error 400". */
const unwrap = async (response: Response) => {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.error ?? `Żądanie nie powiodło się (HTTP ${response.status})`);
  }
  return body;
};

export const getAdminSession = (): Promise<{
  admin: boolean;
  configured: boolean;
}> => fetch("/api/admin/session", { cache: "no-store" }).then(unwrap);

export const signInAsAdmin = (secret: string): Promise<{ admin: boolean }> =>
  fetch("/api/admin/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret }),
  }).then(unwrap);

export const signOutAsAdmin = (): Promise<{ admin: boolean }> =>
  fetch("/api/admin/session", { method: "DELETE" }).then(unwrap);
