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
    const invalid = types.explainSchemaCheck(
      types.getPrunedSchema(schema, configs[config]),
      schema,
    );
    if (invalid) {
      throw new Error(`Config "${config}" is invalid:\n${invalid}`);
    }
  }
  return configs[config];
};

export const get = <S extends types.Schema<any, any>>(
  config: string,
  schema?: S,
): types.InferType<S> => {
  return getConfig(config, schema);
};

type Env = Record<string, string | boolean | number>;

let ENV: Env = {};
export const setEnv = (env: Env) => {
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
