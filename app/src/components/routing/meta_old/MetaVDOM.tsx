import { Link, Meta, MetaTags } from "../api/MetaTags";
import React, { ReactElement } from "react";
import { v4 as uuid } from "uuid";
import { useUUID } from "octobox-utils";

/**
 * A MetaVDOM object represents a VDOM storing meta tags, links, and the page title.
 */
export class MetaVDOM {

  // instance of this class
  private static _vdom: MetaVDOM | undefined;

  /**
   * Makes or gets the VDOM.
   */
  static get vdom(): MetaVDOM {
    if(MetaVDOM._vdom === undefined) {
      MetaVDOM._vdom = new MetaVDOM();
    }
    return MetaVDOM._vdom;
  }

  // the vdom itself
  private tags: MetaTags;
  private firstTitle: string;

  constructor() {
    this.firstTitle = document.title;
    document.getElementsByTagName("title")[0].setAttribute("data-execution", useUUID());
    this.tags = { title: this.firstTitle, links: [], metas: [] };
  }

  /**
   * Modifies the VDOM.
   * @param tags
   */
  public modify(tags: MetaTags) {
    // i have been here for 4 hours trying to figure out a good way to do this. i just realized its doable with two lines...
    this.tags = tags;
    this.draw();
  }

  private draw() {
    // get the id of the current compilation
    const id = useUUID();
    // add new title
    const title = this.tags.title ?? this.firstTitle;
    console.log(title);
    const titleElement = document.createElement("title");
    titleElement.append(title);
    titleElement.setAttribute("data-execution", id);
    document.getElementsByTagName("title")[0].replaceWith(titleElement);
    // add other new meta
    if(this.tags.links !== undefined) {
      for(const tag of this.tags.links) {
        // for each link tag, compile it
        const element = document.createElement("link");
        for(const attr in tag) {
          if(attr !== "namespace") {
            element.setAttribute(attr, tag[attr]!);
          }
        }
        element.setAttribute("data-execution", id);
        // then add it to the head
        document.head.appendChild(element);
      }
    }
    if(this.tags.metas !== undefined) {
      for(const tag of this.tags.metas) {
        // for each meta tag, compile it
        const element = document.createElement("link");
        for(const attr in tag) {
          if(attr !== "namespace") {
            element.setAttribute(attr, tag[attr]!);
          }
        }
        element.setAttribute("data-execution", id);
        // then add it to the head
        document.head.appendChild(element);
      }
    }
    // remove all tags from the head that were set by a previous run of this method
    for(const child of document.head.children) {
      if(child.hasAttribute("data-execution") && child.getAttribute("data-execution") !== id) {
        document.head.removeChild(child);
      }
    }
  }

}