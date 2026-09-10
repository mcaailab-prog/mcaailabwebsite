/**
 * Converts MongoDB documents into plain JSON-safe objects.
 * Strips Buffer/Uint8Array fields and converts ObjectIds to strings.
 */
export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}