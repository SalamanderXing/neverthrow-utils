import {  err, ok, Result } from "neverthrow";

export default {
  retry: async function <T>(
    fn: () => Promise<Result<T, Error>>,
    maxRetries: number = 3,
    delayMs: number = 500,
    timeoutMs: number = 5000, // New parameter for timeout
  ): Promise<Result<T, Error>> {
    let retries = 0;
    let result: Result<T, Error> = err(new Error("Initial error"));

    const executeWithTimeout = async (): Promise<Result<T, Error>> => {
      return Promise.race([
        fn(),
        new Promise<Result<T, Error>>((_, reject) =>
          setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)
        ),
      ]);
    };

    while (retries < maxRetries) {
      try {
        result = await executeWithTimeout();

        if (result.isOk()) {
          return result;
        }
      } catch (error) {
        result = err(error instanceof Error ? error : new Error(String(error)));
      }

      retries++;
      if (retries < maxRetries) {
        console.log(`Retrying (attempt ${retries + 1})`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    return result;
  },
  parseJSON: function <T = any>(json: string): Result<T, Error> {
    try {
      return ok(JSON.parse(json) as T);
    } catch (error) {
      return err(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  },
};
