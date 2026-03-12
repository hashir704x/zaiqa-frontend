const API_URL = import.meta.env.VITE_API_URL;

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthSuccessResponse = {
  user: AuthUser;
};

async function handleAuthResponse(response: Response): Promise<AuthUser> {
  const contentType = response.headers.get("Content-Type") ?? "";

  let body: any = null;
  if (contentType.includes("application/json")) {
    body = await response.json().catch(() => null);
  }

  if (!response.ok) {
    const message =
      body?.message ??
      body?.error ??
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  const data = body as AuthSuccessResponse | null;
  if (!data?.user) {
    throw new Error("Invalid auth response from server.");
  }

  return data.user;
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  return handleAuthResponse(response);
}

export async function login(
  email: string,
  password: string,
): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleAuthResponse(response);
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok && response.status !== 204) {
    let message = `Logout failed with status ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string; error?: string };
      message = body.message ?? body.error ?? message;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }
}

