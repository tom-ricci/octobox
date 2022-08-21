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
 * A wildcard compilier config tells the compilier this will be a wildcard window. If the window makes use of the path in any way, paths can be provided to compile the window with. These paths are relative to the location of the window whether you use <code>./</code> or <code>/</code>.
 */
export interface WildcardCompilierConfig extends BaseCompilierConfig {
  type: "wildcard"
  paths: [string, ...string[]]
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
 * A CompilierConfig definies the configuration values for the Octobox prerenderer/compilier.
 *
 * If a config is specified for a default window of another window, the default window's config will be used when the default window should be displayed, and the other window's config will be used when a different child window is rendered. If a config is specified in both a normal window (parent) and that window's default window (child), the parent config will be used when compiling windows nested below the parent, and the child config will be used when compiling the parent window's path. CompilierConfigs use <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions">union discrimination</a>, so certain configuration values may be required or typed based on the types of other values.
 */
export type CompilierConfig = DynamicCompilierConfig | WildcardCompilierConfig | StaticCompilierConfig | DisabledCompilierConfig;
