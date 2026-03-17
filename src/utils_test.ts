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

  expect(
    commitForRelease(
      "Update {{extensionName}} to v{{version}}\n\nRelease notes:\n\nhttps://github.com/{{owner}}/{{repo}}/releases/tag/{{tag}}",
      {
        extensionName: "html",
        version: "0.1.2",
        owner: "huacnlee",
        repo: "zed",
        tag: "html-v0.1.2",
      },
    ),
  ).toEqual(
    "Update html to v0.1.2\n\nRelease notes:\n\nhttps://github.com/huacnlee/zed/releases/tag/html-v0.1.2"
  );
});
