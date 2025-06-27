import { randomUUID } from 'crypto';

// Add crypto.randomUUID to the global object if it doesn't exist
if (!('crypto' in globalThis)) {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: () => randomUUID()
    }
  });
}
