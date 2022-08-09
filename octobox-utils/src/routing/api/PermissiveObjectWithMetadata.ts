import { PermissiveObject } from "./PermissiveObject";
import { MetaTags } from "./MetaTags";

/**
 * A PermissiveObjectWithMetadata is a {@link PermissiveObject} where the <code>metadata</code> key is reserved to contain {@link MetaTags}.
 */
export interface PermissiveObjectWithMetadata extends PermissiveObject {
  metadata?: MetaTags;
}