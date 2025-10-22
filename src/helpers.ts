export const parseB64 = (str: string) => {
  try {
    if (atob) {
      return atob(str);
    }
    throw new ReferenceError("atob is not defined");
  } catch (e) {
    if (e instanceof ReferenceError) {
      return Buffer.from(str, "base64").toString("ascii");
    }
    throw e;
  }
};

export const makeEnvName = (name) => name.toUpperCase().replace(/-/g, "_");
