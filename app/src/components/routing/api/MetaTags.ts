/**
 * MetaTags are just {@link PermissiveObject}s which only allow strings for keys. They represent the meta tags of a Window. Windows will inherit their parent's meta tags, meaning you only need to redefine the meta tags which should be different than the parent's route.
 */
export interface MetaTags {
  [x: string]: unknown;
}
