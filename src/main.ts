import { getInput, getBooleanInput } from "@actions/core";
import type { API } from "./api";
import editGitHubBlob from "./edit_github_blob";
import { EditOptions } from "./edit_github_blob";
import { removeRevisionLine, updateVersion } from "./replace_extension_toml";
import { context } from "@actions/github";
import { commitForRelease, getExtensionPath } from "./utils";

export default async function (api: (token: string) => API): Promise<void> {
  const internalToken =
    process.env.GITHUB_TOKEN || process.env.COMMITTER_TOKEN || "";
  const externalToken = process.env.COMMITTER_TOKEN || "";

  const options = await prepareEdit(api(internalToken), api(externalToken));
  const createdUrl = await editGitHubBlob(options);
  console.log(createdUrl);
}

export async function prepareEdit(
  _sameRepoClient: API,
  crossRepoClient: API,
): Promise<EditOptions> {
  const tagName =
    getInput("tag-name") ||
    ((ref) => {
      if (!ref.startsWith("refs/tags/")) throw `invalid ref: ${ref}`;
      return ref.replace("refs/tags/", "");
    })(context.ref);

  const [owner, repo] = getInput("zed-extensions", { required: true }).split(
    "/",
  );

  let pushTo: { owner: string; repo: string } | undefined;
  const pushToSpec = getInput("push-to");
  if (pushToSpec) {
    const [pushToOwner, pushToRepo] = pushToSpec.split("/");
    pushTo = { owner: pushToOwner, repo: pushToRepo };
  } else if (
    owner.toLowerCase() == context.repo.owner.toLowerCase() &&
    repo.toLowerCase() == context.repo.repo.toLowerCase()
  ) {
    // If the homebrew-tap to update is the same repository that is running the Actions workflow,
    // explicitly set the same repository as the push-to target to skip any attempt of making a
    // fork of the repository. This is because a generated GITHUB_TOKEN would still appear as it
    // doesn't have permissions to push to homebrew-tap, even though it does.
    pushTo = context.repo;
  }
  const extensionName =
    getInput("extension-name") || context.repo.repo.toLowerCase();
  const branch = getInput("base-branch");
  const extensionPath =
    getInput("extension-path") || getExtensionPath(extensionName);
  const version = tagName.replace(/^v(\d)/, "$1");

  const messageTemplate = getInput("commit-message", { required: true });

  let makePR: boolean | undefined;
  if (getInput("create-pullrequest")) {
    makePR = getBooleanInput("create-pullrequest");
  }

  const replacements = new Map<string, string>();
  replacements.set("version", version);

  console.log("context", context);

  const commitMessage = commitForRelease(messageTemplate, {
    owner: context.repo.owner,
    repo: context.repo.repo,
    extensionName,
    version,
  });

  return {
    apiClient: crossRepoClient,
    owner,
    repo,
    branch,
    extensionPath,
    commitMessage,
    pushTo,
    makePR,
    submoduleCommitSha: context.sha,
    replace(oldContent: string) {
      return removeRevisionLine(
        updateVersion(oldContent, extensionName, version),
      );
    },
  };
}
