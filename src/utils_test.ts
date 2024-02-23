import { test, expect } from "bun:test";
import { commitForRelease } from "./utils";

test("commitForRelease", () => {
  expect(
    commitForRelease(
      "https://github.com/{{owner}}/{{repp}}/releases/tag/{{tag}}",
      {
        owner: "huacnlee",
        repp: "zed-theme-macos-classic",
        tag: "v0.1.2",
      },
    ),
  ).toEqual(
    "https://github.com/huacnlee/zed-theme-macos-classic/releases/tag/v0.1.2",
  );
});
