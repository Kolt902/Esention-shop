import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options?: RequestInit,
): Promise<any> {
  const res = await fetch(url, {
    method: 'GET',
    credentials: "include",
    ...options,
  });

  await throwIfResNotOk(res);
  
  // Try to parse JSON response
  try {
    return await res.json();
  } catch (e) {
    // Return empty object if not JSON
    return {};
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: true, // Включаем перезапрос при фокусе окна
      staleTime: 0, // Данные всегда считаются устаревшими
      retry: 2, // Повторяем запрос 2 раза в случае ошибки
    },
    mutations: {
      retry: 1, // Повторяем мутацию 1 раз в случае ошибки
    },
  },
});
