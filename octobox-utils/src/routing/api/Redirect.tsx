import React from "react";
import { Navigate } from "@tanstack/react-location";
import { useRedirect } from "./useRedirect";

/**
 * This component allows you to programatically navigate through your application. When rendered, it will act as if the user clicked an Anchor and will take the user where they want to go as defined by its props.
 * @see useRedirect
 */
export const Redirect = Navigate;
