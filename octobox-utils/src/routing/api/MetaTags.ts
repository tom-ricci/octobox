/**
 * MetaTags define the information stored in the document's head while a specific Window is rendered. Tags cascade based on their keys, meaning you only need to redefine the meta tags which should be different than the ones of the Window's parent. The <code>title</code> property is the title of the HTML page, <code>links</code> contains your <code>&#60;link&#62;</code> tags, and <code>meta</code> contains your <code>&#60;meta&#62;</code> tags.
 */
export interface MetaTags {
  title?: Title;
  links?: {
    [x: string]: Link;
  };
  meta?: {
    [a: string]: Meta;
  }
}

export type Title = string;

export type Link = {
  as?: string;
  crossorigin?: string;
  disabled?: string;
  fetchpriority?: string;
  href?: string;
  hreflang?: string;
  imagesizes?: string;
  imagesrcset?: string;
  integrity?: string;
  media?: string;
  prefetch?: string;
  referrerpolicy?: string;
  rel?: string;
  sizes?: string;
  title?: string
  type?: string;
  key?: never;
  prerender?: never;
  [x: string]: string | undefined;
}

export type Meta = {
  charset?: string;
  content?: string;
  "http-equiv"?: string;
  id?: string;
  itemprop?: string;
  name?: string;
  property?: string;
  scheme?: string;
  url?: string;
  key?: never;
  prerender?: never;
  [x: string]: string | undefined;
};