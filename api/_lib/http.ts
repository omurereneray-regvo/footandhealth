export type ApiRequest = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
};

export type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  redirect: (code: number, url: string) => void;
  setHeader: (name: string, value: string | string[]) => void;
};

export function bodyOf<T>(value: unknown): Partial<T> {
  return value && typeof value === 'object' ? (value as Partial<T>) : {};
}

export function cookie(req: ApiRequest, name: string) {
  const header = req.headers?.cookie;
  const raw = Array.isArray(header) ? header.join(';') : header ?? '';
  return raw.split(';').map((entry) => entry.trim()).find((entry) => entry.startsWith(`${name}=`))?.slice(name.length + 1);
}

export function cookieHeader(name: string, value: string, maxAge?: number) {
  const expires = maxAge === 0 ? '; Max-Age=0' : maxAge ? `; Max-Age=${maxAge}` : '';
  return `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Secure${expires}`;
}
