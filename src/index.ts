import * as types from "@apparts/types";
import { load } from "./config";
import { makeEnvName, parseB64 } from "./helpers";

const configs = {};

/**
 * Returns the config specified by the config parameter. If the config
 * is not yet loaded, it will be loaded.
 * @param config String that contains config-name
 * @returns {} Configuration-object
 */
export const getConfig = <S extends types.Schema<any, any>>(
  config: string,
  schema?: S,
): types.InferType<S> => {
  if (!configs[config]) {
    loadConfig(config);
  }
  if (schema) {
    const invalid = types.explainSchemaCheck(configs[config], schema);
    if (invalid) {
      throw new Error(`Config "${config}" is invalid:\n${invalid}`);
    }
  }
  return configs[config];
};

let ENV: Record<string, string> = {};
export const setEnv = (env: Record<string, string>) => {
  ENV = env;
};

const loadConfig = (config: string) => {
  return load({
    config,
    configEnvName: makeEnvName(config),
    env: ENV,
    parseB64: parseB64,
    configs,
  });
};
