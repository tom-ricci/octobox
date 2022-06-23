import { Config } from "../WindowManager";
import { MetaTags } from "../api/MetaTags";

/**
 * Represents a configuration of metadata as a tree.
 */
export interface MetaConfig {
  path: string;
  meta?: { path: string, meta: MetaTags };
  children?: MetaConfig[];
  parent?: MetaConfig;
  excused: string;
}

/**
 * Manages the storage and retrieval of app metadata.
 */
export class MetadataManager {

  private static _manager: MetadataManager;
  public static path: string;

  public static get manager() {
    return this._manager;
  }

  public static set manager(manager) {
    this._manager = manager;
  }

  private config: MetaConfig;
  private entries: { [x: string]: MetaConfig } = {};

  constructor(config: Config) {
    this.config = this.create(config);
  }

  /**
   * Creates a new {@link MetaConfig} based on a normal {@link Config}.
   * @param config
   * @param parent
   * @private
   */
  private create(config: Config, parent?: MetaConfig): MetaConfig {
    const mc: MetaConfig = { path: config.path, excused: "" };
    if(parent !== undefined) {
      mc.parent = parent;
    }
    if(config.loader !== undefined) {
      mc.meta = { path: MetadataManager.path, meta: { links: { "": {} }, meta: { "": {} } } };
    }
    if(config.children !== undefined) {
      mc.children = [];
      for(const child of config.children) {
        mc.children.push(this.create(child, mc));
      }
    }
    this.entries[mc.path] = mc;
    return mc;
  }

  /**
   * Updates the metadata at a certain entry in the config with the new metadata. The metadata may be updated in the DOM too if all is well.
   * @param route
   * @param meta
   */
  public update(route: string, meta: MetaTags) {
    this.entries[route].meta = { path: MetadataManager.path, meta };
    this.scan();
  }

  /**
   * Allows an entry to be "excused" from being forced to have been updated for the next DOM change.
   * @param route
   */
  public excuse(route: string) {
    this.entries[route].excused = MetadataManager.path;
    this.scan();
  }

  /**
   * Scans the configuration and path to determine if there's enough metadata to begin the next DOM update.
   */
  public scan() {
    // TODO: meta
  }

}




