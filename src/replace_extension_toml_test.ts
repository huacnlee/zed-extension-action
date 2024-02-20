import { test, expect } from "bun:test";
import { updateVersion } from "./replace_extension_toml";

test("updateVersion", () => {
  let raw = `
  [assembly]
  version = "0.0.1"
  path = "extensions/assembly"

  [beancount]
  path = "extensions/beancount"
  version = "0.0.1"
  `;

  expect(updateVersion(raw, "beancount", "0.1.2")).toEqual(`
  [assembly]
  version = "0.0.1"
  path = "extensions/assembly"

  [beancount]
  path = "extensions/beancount"
  version = "0.1.2"
  `);

  expect(updateVersion(raw, "assembly", "test")).toEqual(`
  [assembly]
  version = "test"
  path = "extensions/assembly"

  [beancount]
  path = "extensions/beancount"
  version = "0.0.1"
  `);
});
