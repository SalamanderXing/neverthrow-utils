import { Result } from "neverthrow";
declare const _default: {
  retry: <T>(
    fn: () => Promise<Result<T, Error>>,
    maxRetries?: number,
    delayMs?: number,
    timeoutMs?: number,
  ) => Promise<Result<T, Error>>;
};
export default _default;
