export class UpgradeError extends Error {}

export function updateVersion(
  raw: string,
  extensionName: string,
  newVersion: string,
): string {
  let re = new RegExp(
    `(\\[${extensionName}\\]\\s+(.*\\s*))(version = ".+?")`,
    "gm",
  );
  return raw.replace(re, `$1version = "${newVersion}"`);
}

export function removeRevisionLine(oldContent: string): string {
  return oldContent.replace(/^[ \t]*revision \d+ *\r?\n/m, "");
}
