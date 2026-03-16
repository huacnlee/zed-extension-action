import { expect, test } from "bun:test";

import { parseVersionFromTag, fromUrl } from "./version";

test("fromUrl()", () => {
  const cases = new Map<string, string>([
    [
      "https://github.com/me/myproject/archive/refs/tags/v1.2.3.tar.gz",
      "v1.2.3",
    ],
    [
      "https://github.com/me/myproject/releases/download/v1.2.3/file.tgz",
      "v1.2.3",
    ],
    ["http://myproject.net/download/v1.2.3.tgz", "v1.2.3"],
    ["https://example.com/v1.2.3.zip", "v1.2.3"],
    [
      "https://github.com/SmartThingsCommunity/smartthings-cli/releases/download/%40smartthings%2Fcli%401.7.0/smartthings-macos-arm64.tar.gz",
      "@smartthings/cli@1.7.0",
    ],
    [
      "https://github.com/SmartThingsCommunity/smartthings-cli/releases/download/@smartthings/cli@1.7.0/smartthings-macos-x64.tar.gz",
      "@smartthings/cli@1.7.0",
    ],
    [
      "https://github.com/orf/gping/archive/refs/tags/gping-v1.14.0.tar.gz",
      "gping-v1.14.0",
    ],
  ]);
  for (const item of cases) {
    expect(fromUrl(item[0])).toEqual(item[1]);
  }
});

test("parse()", () => {
  expect(parseVersionFromTag("v1.2.0")).toEqual("1.2.0");
  expect(parseVersionFromTag("v123.456.789")).toEqual("123.456.789");
  expect(parseVersionFromTag("v123.456.789-beta")).toEqual("123.456.789");
  expect(parseVersionFromTag("v1.2.0-beta")).toEqual("1.2.0");
  expect(parseVersionFromTag("v1.2.0-beta.2")).toEqual("1.2.0");
  expect(parseVersionFromTag("html-v1.2.0")).toEqual("1.2.0");
  expect(parseVersionFromTag("gping-v1.13")).toEqual("1.13");
  expect(parseVersionFromTag("@smartthings/cli@1.7.0")).toEqual("1.7.0");
});
