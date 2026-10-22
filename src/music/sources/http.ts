/** Bound every request and propagate cancellation, including response-body parsing. */
export async function fetchSourceJson(url: string, signal?: AbortSignal): Promise<unknown> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(abort, 15_000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(response.status === 429 ? 'La fuente está ocupada. Intenta de nuevo en unos minutos.' : 'No se pudo consultar la fuente. Vuelve a intentar.');
    return await response.json();
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}
