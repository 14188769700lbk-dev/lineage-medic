import handler from "vinext/server/app-router-entry";

interface WorkerEnvironment {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

export default {
  fetch(
    request: Request,
    environment: WorkerEnvironment,
    context: ExecutionContext,
  ): Promise<Response> {
    return handler.fetch(request, environment, context);
  },
};
