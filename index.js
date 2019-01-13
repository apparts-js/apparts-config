"use strict";

module.exports.configs = {};

/**
 * Loads a config. Tries to load from an environment variable with the
 * name of the desired config with all dashes replaced by underscores
 * (e.g. db-credentials would be DB_CREDENTIALS).  If such a variable
 * is found, it is tried to read it as JSON, if not possible it will
 * be decoded from base64 and and then read as JSON.  If no such
 * variale is found, a file with the config-name and the
 * json-file-ending will be required from a config-folder that lies in
 * the directory in which node has been executed.
 * @param config String that contains config-name
 */
module.exports.load = (config) => {
  let env_name = config.toUpperCase().replace('-', '_');
  if(process.env[env_name]){
    if(/["{\[]$/.test(process.env[env_name])){
      try {
        module.exports.configs[config] =
          JSON.parse(process.env[env_name]);
      } catch(e) {
        throw (`Parsing of Env-Config failed: "${env_name}" with`
                     + ` value "${process.env[env_name]}"`);
      }
    } else {
      try {
        module.exports.configs[config] =
          JSON.parse(Buffer.from(process.env[env_name], 'base64')
                     .toString('ascii'));
      } catch(e){
        throw (`Parsing of Env-B64-Config failed: "${env_name}" with`
                     + ` value "${process.env[env_name]}"`);
        throw (`Ascii: "${Buffer.from(process.env[env_name], 'base64').toString('ascii')}"`);
      }
    }
  } else {
    module.exports.configs[config] = require('../config/' + config + '.json');
  }
};

/**
 * Returns the config specified by the config parameter. If the config
 * is not yet loaded, it will be loaded.
 * @param config String that contains config-name
 * @returns {} Configuration-object
 */
module.exports.get = (config) => {
  if(!module.exports.configs[config]){
    module.exports.load(config);
  }
  return module.exports.configs[config];
};
