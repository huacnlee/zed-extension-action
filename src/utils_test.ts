import { test, expect } from "bun:test";
import { commitForRelease } from "./utils";

test("commitForRelease", () => {
  expect(
    commitForRelease(
      "Hello world {{owner}}/{{repp}} {{tag}}\n\nhttps://github.com/{{owner}}/{{repp}}/releases/tag/{{tag}}",
      {
        owner: "huacnlee",
        repp: "zed-theme-macos-classic",
        tag: "v0.1.2",
      },
    ),
  ).toEqual(
    "Hello world huacnlee/zed-theme-macos-classic v0.1.2\n\nhttps://github.com/huacnlee/zed-theme-macos-classic/releases/tag/v0.1.2",
  );
});
