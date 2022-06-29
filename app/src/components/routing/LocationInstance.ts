import { ReactLocation } from "@tanstack/react-location";

/**
 * Manages one ReactLocation instance. Useful for {@link useRoutingInternals}.
 */
export class LocationInstance {

  private static _location: ReactLocation | undefined;

  static get location(): ReactLocation | undefined {
    return this._location;
  }

  static setLocation(location: ReactLocation) {
    this._location = location;
  }

}
