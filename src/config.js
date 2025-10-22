class ParsingError extends Error {}
class UnexpectConfigError extends Error {}

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
export const load = (params) => {
  const {
    config,
    configEnvName: env_name,
    env: ENV,
    parseB64,
    configs: configsObj,
  } = params;
  try {
    const env = { ...process?.env, ...ENV };
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
        configsObj[config] = JSON.parse(val);
      } catch (e) {
        try {
          configsObj[config] = JSON.parse(parseB64(val));
        } catch (e) {
          throw new ParsingError(
            `Could not load config ${config}. Please make sure, you set up the config correctly:

Parsing as JSON or base64 failed: "${env_name}" with value "${val}"`,
          );
        }
      }
    } else {
      const directoryJSON = `${process.cwd()}/config/${config}.json`;
      const directoryJSONExample = `${process.cwd()}/config/${config}.example.json`;
      const directoryJS = `${process.cwd()}/config/${config}.js`;

      try {
        // eval helps to get's rid of warnings in react env.
        configsObj[config] = eval(`require(${JSON.stringify(directoryJS)})`);
        return;
      } catch (e) {
        if (e.code !== "MODULE_NOT_FOUND") {
          throw new UnexpectConfigError(
            `Unexpected error with ${directoryJS}: ${e}`,
          );
        }
      }

      try {
        try {
          // eval helps to get's rid of warnings in react env.
          const fs = eval('require("fs")');
          configsObj[config] = JSON.parse(fs.readFileSync(directoryJSON));
        } catch (e) {
          if (e.code === "ENOENT") {
            try {
              // eval helps to get's rid of warnings in react env.
              const fs = eval('require("fs")');
              const val = fs.readFileSync(directoryJSONExample);
              try {
                configsObj[config] = JSON.parse(val);
              } catch (e) {
                throw new ParsingError(
                  `Could not load config ${config}. Please make sure, you set up the config correctly:

Parsing as JSON or base64 failed: "${config}" with value "${val}"`,
                );
              }
            } catch (e) {
              if (e.code === "ENOENT") {
                throw new UnexpectConfigError(
                  `Neither ${directoryJSON} nor ${directoryJSONExample}` +
                    ` nor ${directoryJS} found: ${e}`,
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
        throw new UnexpectConfigError(
          `Unknown error while trying to parse ${directoryJSON}: ${e}`,
        );
      }
    }
  } catch (e) {
    if (e instanceof ParsingError) {
      throw e.message;
    }

    // eslint-disable-next-line no-restricted-globals
    console.log(e);
    throw `Could not find config ${config}. Please make sure, you set up the config correctly:

On node systems, the config is stored in one of these locations:
- in a config folder as ${config}.json or ${config}.js or ${config}.example.json
- as a environment variable ${env_name}, either as raw text or as base 64 encoded text.

With create-react-app:
- Make sure you called
  > import { setEnv } from "@apparts/config"; setEnv(process.env);
  at the beginning of your app.
- Config is in the .env file with the variable name REACT_APP_${
      env_name
    } or VITE_${env_name} either as raw text or base 64 encoded.
    `;
  }
};
