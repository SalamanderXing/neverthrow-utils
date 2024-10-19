import { err } from "neverthrow";
export default {
  retry: async function (fn, maxRetries = 3, delayMs = 500, timeoutMs = 5000) {
    let retries = 0;
    let result = err(new Error("Initial error"));
    const executeWithTimeout = async () => {
      return Promise.race([
        fn(),
        new Promise((_, reject) =>
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
};
