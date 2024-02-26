/**
 * Prepare a commit message for a release with the given parameters.
 */
export function commitForRelease(
  messageTemplate: string,
  params: { [key: string]: string } = {},
): string {
  return messageTemplate.replace(
    /\{\{(\w+)\}\}/gm,
    (m: string, key: string): string => {
      if (Object.hasOwnProperty.call(params, key)) {
        return params[key];
      }
      return m;
    },
  );
}

export function getExtensionPath(extensionName: string): string {
  return `extensions/${extensionName}`;
}
