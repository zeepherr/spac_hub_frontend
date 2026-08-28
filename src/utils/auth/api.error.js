export function getApiError(error, fallbackMessage = "Something went wrong.") {
  if (!error?.response) {
    return {
      status: 0,
      code: "NETWORK_ERROR",
      message: "Unable to connect to the server.",
    };
  }

  const { status, data = {} } = error.response;

  const code = data.code ?? `HTTP_${status}`;
  const fieldErrors = data.errors ?? null;

  let message = data.message ?? fallbackMessage;

  if (code === "VALIDATION_ERROR" && Array.isArray(fieldErrors)) {
    message = fieldErrors[0]?.message ?? message;
  }

  return {
    status,
    code,
    message,
    fieldErrors,
    attemptsRemaining: data.attemptsRemaining ?? null,
    retryAfterSeconds: data.retryAfterSeconds ?? null,
    expiresAt: data.expiresAt ?? null,
    resendAvailableAt: data.resendAvailableAt ?? null,
  };
}
