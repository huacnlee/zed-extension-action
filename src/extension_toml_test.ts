import { test, expect } from "bun:test";
import { getExtensionSubmodulePath, updateVersion } from "./extension_toml";

test("updateVersion", () => {
  let raw = `
  [assembly]
  version = "0.0.1"
  submodule = "extensions/assembly"

  [beancount]
  submodule = "extensions/beancount"
  version = "0.0.1"
  `;

  expect(updateVersion(raw, "beancount", "0.1.2")).toEqual(`
  [assembly]
  version = "0.0.1"
  submodule = "extensions/assembly"

  [beancount]
  submodule = "extensions/beancount"
  version = "0.1.2"
  `);

  expect(updateVersion(raw, "assembly", "test")).toEqual(`
  [assembly]
  version = "test"
  submodule = "extensions/assembly"

  [beancount]
  submodule = "extensions/beancount"
  version = "0.0.1"
  `);
});

test("getExtensonSubmodulePath", () => {
  let raw = `
  [assembly]
  version = "0.0.1"
  submodule = "extensions/assembly"

  [beancount]
  submodule = "extensions/beancount"
  version = "0.0.1"
  `;

  expect(getExtensionSubmodulePath(raw, "beancount")).toEqual("extensions/beancount");
  expect(getExtensionSubmodulePath(raw, "assembly")).toEqual("extensions/assembly");
});

