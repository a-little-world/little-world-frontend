export const RETRY_DELAY_MS = 30_000;
export const MAX_RETRIES = 5;

const delay = (ms: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

export async function retry<T>(
  fn: () => Promise<T>,
  signal: AbortSignal,
  delayMs = RETRY_DELAY_MS,
): Promise<T> {
  const attempt = async (retries: number): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (retries >= MAX_RETRIES || signal.aborted) {
        throw error;
      }
      await delay(delayMs);
      if (signal.aborted) {
        throw error;
      }
      return attempt(retries + 1);
    }
  };
  return attempt(0);
}
