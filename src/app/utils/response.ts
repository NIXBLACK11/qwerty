export function jsonResponse(data: unknown, statusCode: number = 200, headers: HeadersInit = {}) {
    return new Response(JSON.stringify(data), {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
  }