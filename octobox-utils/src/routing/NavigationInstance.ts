/**
 * Manages one useNavigate instance. Useful for hookless functional redirects.
 */
export class NavigationInstance {

  private static _nav: any;

  static get nav() {
    return this._nav;
  }

  static set nav(nav) {
    this._nav = nav;
  }

}
