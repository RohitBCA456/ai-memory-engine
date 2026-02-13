import { EventEmitter } from "events";
import { v4 as uuidv4 } from "uuid";

const bridgeEmitter = new EventEmitter();

export const MessageBridge = {
  createCorrelationId: () => uuidv4(),

  waitForResponse: (correlationId, timeoutMs = 10000) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        bridgeEmitter.removeAllListeners(correlationId);
        reject(
          new Error(
            `Timeout: No response for ${correlationId} after ${timeoutMs}ms`,
          ),
        );
      }, timeoutMs);

      bridgeEmitter.once(correlationId, (data) => {
        clearTimeout(timer);
        resolve(data);
      });
    });
  },

  resolveResponse: (correlationId, data) => {
    bridgeEmitter.emit(correlationId, data);
  },
};
