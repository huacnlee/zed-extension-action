import { test, expect } from "bun:test";
import { getExtensionSubmodulePath, updateVersion } from "./extension_toml";

test("updateVersion", () => {
  let raw = `
  [assembly]
  submodule = "extensions/assembly"
  version = "0.0.1"

  [beancount]
  submodule = "extensions/beancount"
  version = "0.0.1"
  
  [clojure]
  submodule = "extensions/zed"
  path = "extensions/clojure"
  version = "0.0.1"
  `;

  expect(updateVersion(raw, "beancount", "0.1.2")).toEqual(`
  [assembly]
  submodule = "extensions/assembly"
  version = "0.0.1"

  [beancount]
  submodule = "extensions/beancount"
  version = "0.1.2"
  
  [clojure]
  submodule = "extensions/zed"
  path = "extensions/clojure"
  version = "0.0.1"
  `);
    
  expect(updateVersion(raw, "assembly", "test")).toEqual(`
  [assembly]
  submodule = "extensions/assembly"
  version = "test"

  [beancount]
  submodule = "extensions/beancount"
  version = "0.0.1"
  
  [clojure]
  submodule = "extensions/zed"
  path = "extensions/clojure"
  version = "0.0.1"
  `);

  expect(updateVersion(raw, "clojure", "3.2.1")).toEqual(`
  [assembly]
  submodule = "extensions/assembly"
  version = "0.0.1"

  [beancount]
  submodule = "extensions/beancount"
  version = "0.0.1"
  
  [clojure]
  submodule = "extensions/zed"
  path = "extensions/clojure"
  version = "3.2.1"
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

