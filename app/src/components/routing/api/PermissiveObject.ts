/**
 * A PermissiveObject is an Object which only allows any data. It can only contain keys and properties, and thus is extremely useful for objects where you know you're going to store <em>something</em>, but not exactly what. Basically, it allows you to have unknown keys without needing to remove all static typing or use the <code>all</code> type.
 */
export interface PermissiveObject {
  [x: string | number | symbol]: unknown;
}