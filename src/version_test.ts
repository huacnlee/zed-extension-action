import { expect, test } from "bun:test";

import { compare, fromUrl } from "./version";

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

test("compare()", () => {
  expect(compare("v1.2.0", "v1.2.1")).toEqual(-1);
  expect(compare("v1.2.0", "v1.1.9.0")).toEqual(1);
  expect(compare("gping-v1.13", "gping-v1.14.0")).toEqual(-1);
  expect(
    compare("@smartthings/cli@1.7.0", "@smartthings/cli@1.7.0-rc2"),
  ).toEqual(1);
  expect(compare("@smartthings/cli@1.7.0", "@smartthings/cli@1.7.0")).toEqual(
    0,
  );
  expect(compare("@smartthings/cli@1.7.0", "@smartthings/cli@1.10.0")).toEqual(
    -1,
  );
});
