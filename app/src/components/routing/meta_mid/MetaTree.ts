import { MetaRoute } from "./MetaRoute";

/**
 * A tree containing all the meta tags which were found in all routes. They may or may not be resolved yet.
 */
export class MetaTree {

  private static _tree: MetaRoute = { path: "", meta: {}, children: [] };
  private static _oldTree: MetaRoute = { path: "", meta: {}, children: [] };

  static get tree() {
    return this._tree;
  }

  static get oldTree() {
    return this._oldTree;
  }

  public static setTree(tree: MetaRoute) {
    this.setOldTree(this._tree);
    this._tree = tree;
  }

  private static setOldTree(tree: MetaRoute) {
    this._oldTree = tree;
  }

}