/**
 * Minimal type declarations for `turndown-plugin-gfm` (no @types package
 * exists on the registry as of this writing). Only declares the exports
 * we actually use — `gfm`, `tables`, `strikethrough`, `taskListItems` —
 * each of which is a turndown plugin function.
 */
declare module "turndown-plugin-gfm" {
  import type TurndownService from "turndown";

  export type Plugin = (service: TurndownService) => void;

  export const gfm: Plugin;
  export const tables: Plugin;
  export const strikethrough: Plugin;
  export const taskListItems: Plugin;
}
