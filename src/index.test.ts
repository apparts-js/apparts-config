import * as types from "@apparts/types";
import { getConfig, setEnv } from "./index";

describe("getConfig", () => {
  it("should get config from json", async () => {
    expect(getConfig("testJson")).toBe("test");
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
  it("should fail to get non-existing key", async () => {
    expect(() => getConfig("testNew")).toThrow();
  });
  it("should find key that was set via setEnv", async () => {
    setEnv({ TESTNEW: JSON.stringify("new") });
    expect(getConfig("testNew")).toBe("new");
  });
  it("should reject wrongly typed config", async () => {
    setEnv({ TESTNEW: JSON.stringify("new") });
    expect(() =>
      getConfig(
        "testNew",
        types.obj({
          configVal: types.int(),
        }),
      ),
    ).toThrow();
  });
  it("should get correctly typed config", async () => {
    setEnv({ TESTNEW2: JSON.stringify({ configVal: 9, extraVal: 4 }) });
    expect(
      getConfig(
        "testNew2",
        types.obj({
          configVal: types.int(),
        }),
      ),
    ).toMatchObject({ configVal: 9 });
  });
  it("should allow primitiv value", () => {
    setEnv({ DEV: true });
    expect(getConfig("dev", types.boolean())).toBe(true);
  });
});
