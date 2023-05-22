module.exports.configs = {};

let ENV;
module.exports.setEnv = (env) => {
  ENV = env;
};

const parseB64 = (str) => {
  try {
    if (atob) {
      return atob(str);
    }
  } catch (e) {
    if (e instanceof ReferenceError) {
      return Buffer.from(str, "base64").toString("ascii");
    }
  }
};

const makeEnvName = (name) => name.toUpperCase().replace(/-/g, "_");

/**
 * Loads a config. Tries to load from an environment variable with the
 * name of the desired config with all dashes replaced by underscores
 * (e.g. db-credentials would be DB_CREDENTIALS).  If such a variable
 * is found, it is tried to read it as JSON, if not possible it will
 * be decoded from base64 and and then read as JSON.  If no such
 * variale is found, a file with the config-name and the
 * json-file-ending or the js-file-ending will be required from a
 * config-folder that lies in the directory in which node has been
 * executed.
 * @param config String that contains config-name
 */
module.exports.load = (config) => {
  let env_name = makeEnvName(config);
  try {
    const env = ENV || process.env;
    if (
      env[env_name] ||
      env["REACT_APP_" + env_name] ||
      env["VITE_" + env_name]
    ) {
      const val =
        env[env_name] ||
        env["REACT_APP_" + env_name] ||
        env["VITE_" + env_name];
      try {
        module.exports.configs[config] = JSON.parse(val);
      } catch (e) {
        try {
          module.exports.configs[config] = JSON.parse(parseB64(val));
        } catch (e) {
          throw (
            `Parsing as JSON or base64 failed: "${env_name}" with` +
            ` value "${val}"`
          );
        }
      }
    } else {
      const directoryJSON = `${process.cwd()}/config/${config}.json`;
      const directoryJSONExample = `${process.cwd()}/config/${config}.example.json`;
      const directoryJS = `${process.cwd()}/config/${config}.js`;

      try {
        // eval helps to get's rid of warnings in react env.
        module.exports.configs[config] = eval(
          `require(${JSON.stringify(directoryJS)})`
        );
        return;
      } catch (e) {
        if (e.code !== "MODULE_NOT_FOUND") {
          throw `Unexpected error with ${directoryJS}: ${e}`;
        }
      }

      try {
        try {
          // eval helps to get's rid of warnings in react env.
          const fs = eval('require("fs")');
          module.exports.configs[config] = JSON.parse(
            fs.readFileSync(directoryJSON)
          );
        } catch (e) {
          if (e.code === "ENOENT") {
            try {
              // eval helps to get's rid of warnings in react env.
              const fs = eval('require("fs")');
              module.exports.configs[config] = JSON.parse(
                fs.readFileSync(directoryJSONExample)
              );
            } catch (e) {
              if (e.code === "ENOENT") {
                throw (
                  `Neither ${directoryJSON} nor ${directoryJSONExample}` +
                  ` nor ${directoryJS} found: ${e}`
                );
              } else {
                throw e;
              }
            }
          } else {
            throw e;
          }
        }
      } catch (e) {
        if (e instanceof SyntaxError) {
          throw `Parsing of Config in directory ${directoryJSON} failed`;
        } else {
          throw `Unknown error while trying to parse ${directoryJSON}: ${e}`;
        }
      }
    }
  } catch (e) {
    console.log(e);
    throw `Could not find config ${config}. Please make sure, you set up the config correctly:

On node systems, the config is stored in one of these locations:
- in a config folder as ${config}.json or ${config}.js or ${config}.example.json
- as a environment variable ${makeEnvName(
      config
    )}, either as raw text or as base 64 encoded text.

With create-react-app:
- Make sure you called
  > import { setEnv } from "@apparts/config"; setEnv(process.env);
  at the beginning of your app.
- Config is in the .env file with the variable name REACT_APP_${makeEnvName(
      config
    )} or VITE_${makeEnvName(config)} either as raw text or base 64 encoded.
    `;
  }
};

/**
 * Returns the config specified by the config parameter. If the config
 * is not yet loaded, it will be loaded.
 * @param config String that contains config-name
 * @returns {} Configuration-object
 */
module.exports.get = (config) => {
  if (!module.exports.configs[config]) {
    module.exports.load(config);
  }
  return module.exports.configs[config];
};

module.exports.getConfig = (config) => {
  if (!module.exports.configs[config]) {
    module.exports.load(config);
  }
  return module.exports.configs[config];
};
