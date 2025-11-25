import { isDebug } from "@actions/core";
import { Octokit } from "@octokit/core";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
import { requestLog } from "@octokit/plugin-request-log";

const GitHub = Octokit.plugin(restEndpointMethods, requestLog).defaults({
  baseUrl: "https://api.github.com",
});

export type API = InstanceType<typeof GitHub>;

type fetch = (url: string, options: fetchOptions) => Promise<Response>;
type fetchOptions = {
  method: string;
  body: string | null;
};

export default function (
  token: string,
  options?: { logRequests?: boolean; fetch?: fetch },
): API {
  return new GitHub({
    request: { fetch: options && options.fetch },
    auth: `token ${token}`,
    log: {
      info(msg: string) {
        if (options && options.logRequests === false) return;
        return console.info(msg);
      },
      debug(msg: string) {
        if (!isDebug()) return;
        return console.debug(msg);
      },
      warn(msg: string) {
        return console.warn(msg);
      },
      error(msg: string) {
        return console.error(msg);
      },
    },
  });
}

export async function createCommit(
  octokit: API,
  owner: string,
  repo: string,
  message: string,
  parentSha: string,
  treeSha: string,
): Promise<string> {
  const {
    data: { sha },
  } = await octokit.request("POST /repos/{owner}/{repo}/git/commits", {
    owner,
    repo,
    message,
    tree: treeSha,
    parents: [parentSha],
  });

  return sha;
}

/**
 * Create or Update branch
 */
export async function createOrUpdateBranch(
  octokit: API,
  owner: string,
  repo: string,
  branch: string,
  newHead: string,
) {
  const branchExists = await octokit
    .request("GET /repos/{owner}/{repo}/branches/{branch}", {
      owner,
      repo,
      branch,
    })
    .then(
      () => true,
      () => false,
    );

  if (branchExists) {
    await octokit.request("PATCH /repos/{owner}/{repo}/git/refs/{ref}", {
      owner,
      repo,
      sha: newHead,
      ref: `heads/${branch}`,
    });
  } else {
    await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
      owner,
      repo,
      sha: newHead,
      ref: `refs/heads/${branch}`,
    });
  }
}

export async function updateRepo(options: {
  octokit: API;
  owner: string;
  repo: string;
  headBranch: string;
  newContent: string;
  commitMessage: string;
  extensionPath: string;
  submoduleNewSha: string;
}) {
  const {
    octokit,
    owner,
    repo,
    headBranch,
    newContent,
    commitMessage,
    submoduleNewSha,
    extensionPath,
  } = options;

  const { data: branch } = await octokit.rest.repos.getBranch({
    owner,
    repo,
    branch: headBranch,
  });

  const parentSha = branch.commit.sha;
  console.log("parentSha", parentSha);

  const tree = await octokit.request("POST /repos/{owner}/{repo}/git/trees", {
    owner,
    repo,
    base_tree: parentSha,
    tree: [
      {
        path: extensionPath,
        // The file mode; one of 100644 for file (blob), 100755 for executable (blob), 040000 for subdirectory (tree), 160000 for submodule (commit), or 120000 for a blob that specifies the path of a symlink.
        mode: "160000",
        type: "commit",
        sha: submoduleNewSha,
      },
      {
        path: "extensions.toml",
        mode: "100644",
        type: "blob",
        content: newContent,
      },
    ],
  });
  const treeSha = tree.data.sha;
  console.log("treeSha", treeSha);

  // Commit
  const commitSha = await createCommit(
    octokit,
    owner,
    repo,
    commitMessage,
    parentSha,
    treeSha,
  );

  await createOrUpdateBranch(octokit, owner, repo, headBranch, commitSha);
}
