const ACK_TIMEOUT = 10_000;

function createSocketError(response, fallbackMessage) {
  const error = new Error(response?.message || fallbackMessage);
  error.code = response?.code;
  return error;
}

function emitWithAcknowledgement(socket, eventName, payload) {
  return new Promise((resolve, reject) => {
    socket
      .timeout(ACK_TIMEOUT)
      .emit(eventName, payload, (timeoutError, response) => {
        if (timeoutError) {
          reject(new Error(`${eventName} acknowledgement timed out.`));
          return;
        }
        if (!response?.success) {
          reject(createSocketError(response, `${eventName} failed.`));
          return;
        }
        resolve(response);
      });
  });
}

export { createSocketError, emitWithAcknowledgement };
