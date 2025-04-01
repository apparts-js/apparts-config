const { getConfig } = require("./index");

describe("getConfig", () => {
  it("should get config from json", async () => {
    expect(getConfig("test")).toBe("test");
  });
  it("should get config from example json", async () => {
    expect(getConfig("test1")).toBe("example");
  });
  it("should get config from example js", async () => {
    expect(getConfig("test2")).toBe("jstest");
  });
  it("should get config from env", async () => {
    expect(getConfig("test3")).toBe("envtest");
    expect(getConfig("btest")).toBe(false);
  });
  it("should get config from base64 env", async () => {
    expect(getConfig("test4")).toBe("envtest2");
  });
  it("should get config from react env", async () => {
    expect(getConfig("test5")).toBe("react");
  });
  it("should get config from vite env", async () => {
    expect(getConfig("test6")).toBe("vite");
  });
});
