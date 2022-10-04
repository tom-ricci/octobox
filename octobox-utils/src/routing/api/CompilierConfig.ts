/**
 * The enabled config tells the compilier to enable compilation for this window.
 */
export interface EnabledCompilierConfig {
  compile: true
}

/**
 * The type containing all global variables between different types of configurations.
 */
export type BaseCompilierConfig = EnabledCompilierConfig

/**
 * A dynamic compilier config tells the compilier this will be a dynamic window. Since it's impossible to navigate to a dynamic window without using a path param, at least one path param must be specified in the <code>params</code> array. Note that params cannot contain slashes, and any ones which do will not be compiled.
 */
export interface DynamicCompilierConfig extends BaseCompilierConfig {
  type: "dynamic"
  params: [string, ...string[]]
}

/**
 * A static compilier config tells the compilier this will be a static window.
 */
export interface StaticCompilierConfig extends BaseCompilierConfig {
  type: "static"
}

/**
 * The disabled config tells the compilier to disable and skip over compilation for this window.
 */
export interface DisabledCompilierConfig {
  compile: false
}

/**
 * A CompilierConfig definies the configuration values for the Octobox prerenderer/compilier. To add one to a window, export a named <code>Config</code> object with this type. Compilation is not supported on pending and error windows.
 *
 * If no config is specified in a window, the window will not be compiled.
 *
 * CompilierConfigs use <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions">union discrimination</a>, so certain configuration values may be required or typed based on the types of other values.
 *
 * When windows have default windows, the default window's config will be used when the default window should be displayed, and the main window's config will be used when a different child window should be rendered. If the default window has no config or compilation is disabled, the main window will not be compiled when the default window should be displayed.
 *
 * If a dynamic window has compilation disabled in its config or does not contain a config, its child windows will not be compiled regardless of their configs. This is due to a technical impossibility, and does not occour with the children of static windows.
 */
export type CompilierConfig = DynamicCompilierConfig | StaticCompilierConfig | DisabledCompilierConfig;
