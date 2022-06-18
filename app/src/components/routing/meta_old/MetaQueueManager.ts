import { MetaTags } from "../api/MetaTags";
import { MetaVDOM } from "./MetaVDOM";
import { useUUID } from "octobox-utils";

interface MetaQueue {
  [id: string]: MetaTags;
}

/**
 * Manages the metadata VDOM update queue. The VDOM update queue is the system which determines when to update the VDOM and with what data. The queue is a priority queue sorted by the time of metadata being requested to be painted to the screen.
 */
export class MetaQueueManager {

  private static _manager: MetaQueueManager;

  /**
   * Makes or gets the queue.
   */
  static get manager(): MetaQueueManager {
    if(this._manager === undefined) {
      this._manager = new MetaQueueManager();
    }
    return this._manager;
  }

  private queue: MetaQueue = {};
  // the latest ID
  private _id: string = useUUID();

  /**
   * Gets the ID of the latest resolution.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Sets the ID of the latest resolution.
   * @param id
   */
  set id(id: string) {
    this._id = id;
  }

  /**
   * Takes a list of promises of metadata and the time they were requested to be resolved, and resolves them. Resolution, in this case, is the process of unpacking and compiling the metadata promised. It will then ask nicely for the queue to update the VDOM with its information, but updating isn't guaranteed.
   * @param promises
   * @param id
   */
  public async resolve(promises: Promise<Promise<MetaTags>>[], id: string) {
    // resolve the tags
    const tags: MetaTags[] = [];
    for(const promise of promises) {
      const firstResolution = await promise;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const secondResolution = await firstResolution();
      tags.push(secondResolution);
    }
    console.log(tags);
    if(tags.length > 1) {
      // overwrite the parent tags with child ones
      for(const tag of tags) {
        const title = tags[0].title;
        tags[0].title = tag.title ?? title;
      }
      for(let i = 1; i < tags.length; i++) {
        if(tags[0].links !== undefined && tags[i].links !== undefined) {
          for(const link of tags[i].links!) {
            for(let flink of tags[0].links) {
              if(link.namespace === flink.namespace) {
                flink = link;
              }
            }
          }
        }
        if(tags[0].metas !== undefined && tags[i].metas !== undefined) {
          for(const meta of tags[i].metas!) {
            for(let fmeta of tags[0].metas) {
              if(meta.namespace === fmeta.namespace) {
                fmeta = meta;
              }
            }
          }
        }
      }
    }
    // add resolution to the queue
    if(!(id in this.queue)) {
      this.queue[id] = tags[0];
    }
    // update
    this.update();
  }

  /**
   * Updates the VDOM. To update, this method will find the latest item in the queue. If that item has been resolved, it will update the VDOM with that item. If not, it will cancel the update.
   * @private
   */
  private async update() {
    const item = this.queue[this.id];
    if(item !== undefined && item !== null) {
      MetaVDOM.vdom.modify(item);
      for(const key in this.queue) {
        delete this.queue[key];
      }
    }
  }

}
